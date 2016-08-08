class InvoicesController < ApplicationController
  before_action :get_user_invoices
  before_action :set_invoice, only: [:show, :edit, :update, :destroy, :email_invoice]
  before_action :get_user_logo, only: [:new, :edit]
  before_action :set_invoices_or_estimate_index_page, only: [:index]
  before_action :set_create_invoice, only: [:create]
  before_action :format_invoice_type, only: [:create, :update]
  before_action :set_client_if_not_nil, only: [:create, :update]
  before_action :set_number_of_jobs_not_to_be_deleted, only: [:create, :update]
  before_action :set_initial_balance, only: [:create]
  before_action :set_relevant_invoice_or_estimate_number, only: [:edit, :update]

  after_action :merge_client_if_name_exists, only: [:create, :update]
  after_action :remove_jobs_set_to_delete, only: [:create, :update]
  after_action :set_logo_dimensions, only: [:create, :update]

  def index
  end

  def show
    respond_to do |format|
      if params[:invoice_number] || params[:estimate_number]
        format.html
      end
      format.pdf do
        render pdf: "#{@invoice.display_invoice_type} #{@invoice.display_number}", :template => 'invoices/pdf_default.html.erb', show_as_html: params.key?('debug')
      end
    end
  end

  def email_invoice

    if request.format.js?
      
      @email = InvoiceEmail.new(params)

      if @email.valid?
  
        InvoiceMailer.email_invoice(current_user, @invoice, params[:recipient], params[:cc], params[:subject], params[:message]).deliver_now

        flash[:success] = "#{@invoice.display_invoice_type} was successfully emailed!"
        flash.keep(:success)

      end
    end

    respond_to do |format|
      format.html { render partial: '/invoices/email_invoice.html.erb' }
      format.js
    end
  end

  def not_found
  end

  def new
    @invoice = Invoice.new
    
    set_initial_invoice_type_by_url
    set_new_invoice_and_estimate_numbers

    @invoice.jobs.build
  end

  def edit
  end


  def create
    set_new_invoice_and_estimate_numbers

    respond_to do |format|

      if @invoice.save

        format.html { redirect_to invoice_or_estimate_path, flash: { success: "#{@invoice.display_invoice_type} was successfully created!" } }
        format.json { render :show, status: :ok, location: @invoice }

        flash[:success] = "#{@invoice.display_invoice_type} was successfully created!"
        flash.keep(:success)

        format.js do 
          if user_signed_in?
            render_js_invoice_or_estimate_path
          end
        end
        format.html { render invoice_or_estimate_path }
      else
        format.html { render :new }
        format.js 
      end

    end
    
  end


  def update

    respond_to do |format|
      if @invoice.update(invoice_params)
        format.html { redirect_to invoice_or_estimate_path, flash: { success: 'Payment Recorded!' } }
        format.json { render :show, status: :ok, location: @invoice }

        if params[:invoice][:amount_paid].present?
          flash[:success] = 'Payment Recorded!'
          flash.keep(:success)
        else
          flash[:success] = "#{@invoice.display_invoice_type} was successfully updated!"
          flash.keep(:success)
        end

        if params[:from_index_page]
          format.js 
        else
          format.js { render_js_invoice_or_estimate_path }
        end
        
      else
        format.html { render :show }
        format.js 
      end
    end
  end

  def destroy
    #archive_invoice
    invoice = @invoice
    @invoice.destroy
    flash[:success] = "#{invoice.display_invoice_type} deleted!"
    flash.keep(:success)

    respond_to do |format|
      format.js { render js: "window.location = '#{back_to_index_page(invoice)}'" }
    end
  end

  private

    def get_user_invoices
      if user_signed_in?
        @user_invoices = current_user.invoices
      end
    end

    def get_user_logo
      if user_signed_in?
        unless no_current_logos?
          @logo = current_user.current_logo
          @user_logo_url = current_user.display_logo.url
        end
      end
    end
   
    def set_invoice
      if params[:invoice_number]
        @invoice = @user_invoices.find_by(invoice_number: params[:invoice_number])
      elsif params[:estimate_number]
        @invoice = @user_invoices.find_by(estimate_number: params[:estimate_number])
      elsif params[:token]
        @invoice = Invoice.find_by(token: params[:token])
        if @invoice.nil?
          redirect_to no_invoice_found_path
        end
      end

      if @invoice && @invoice.archived
        @invoice = nil
      end

    end

    def set_create_invoice
      if user_signed_in?
        @invoice = @user_invoices.build(invoice_params)
      else
        @invoice = Invoice.create(invoice_params)
      end
    end

    def invoice_params
      params.require(:invoice).permit(:terms, :logo, :invoice_number, :date, :due_date, :name, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line2, :client_id, :notes, :amount_paid, :total, :has_tax, :tax, :tax_included, :numjobs, :logo_width, :logo_height, :user_logo_width, :user_logo_height, :invoice_type, jobs_attributes: [ :id, :job_description, :job_quantity, :job_rate, :will_delete ])
    end

    def invoice_or_estimate_number(invoice_type)
      is_estimate = if invoice_type == "estimate"
        true
      else
        false
      end

      if is_estimate
        base_number = current_user.setting.base_estimate_number || 1
        max_current_number = current_user.invoices.maximum("estimate_number") || 0
      else
        base_number = current_user.setting.base_invoice_number || 1
        max_current_number = current_user.invoices.maximum("invoice_number") || 0
      end

      if current_user.invoices.empty?
        return base_number
      end

      if base_number > max_current_number
        return base_number
      elsif base_number == max_current_number
        return base_number + 1
      end

      if base_number < max_current_number

        used_numbers = if is_estimate
          @user_invoices.where("estimate_number >= ?", base_number).pluck(:estimate_number).sort
        else
          @user_invoices.where("invoice_number >= ?", base_number).pluck(:invoice_number).sort
        end

        for num in base_number..max_current_number
          unless used_numbers.include?(num)
            return num
          end
        end
      end

      max_current_number + 1
    end

    def archive_invoice
      @invoice.update_attribute(:archived, true)
    end

    def remove_jobs_set_to_delete
      @invoice.jobs.where(will_delete: true).destroy_all
    end

    def set_number_of_jobs_not_to_be_deleted
      num_jobs = 0

      unless params[:invoice][:jobs_attributes].nil?

        params[:invoice][:jobs_attributes].each do |job, value|
          unless params[:invoice][:jobs_attributes][job][:will_delete] == "true"
            num_jobs += 1
          end
        end

      end

      if num_jobs == 0 && params[:invoice][:amount_paid].present?
        num_jobs = 1
      end

      @invoice.num_jobs = num_jobs

    end

    def set_client_if_not_nil
      if user_signed_in? && !params[:from_index_page]
        if params.include?(:client_id)
          client_id = params[:client_id].dup
          unless client_id.empty?
             @invoice.client = current_user.clients.find(params[:client_id])
          else
            @invoice.client = nil
          end
        end
      end
    end

   def merge_client_if_name_exists
      if user_signed_in? && !params[:from_index_page]
        if @invoice.valid?
          client_id = @invoice.client_id
          client_name = @invoice.client_name
          client = current_user.clients.where('lower(name) = ?', client_name.downcase).first

          unless client.nil?
            @invoice.client_name = client.name
          end
          @invoice.client = client
          @invoice.save
        end
      end
   end

    def set_initial_balance
      @invoice.balance = @invoice.total
      @invoice.amount_paid = 0
    end

    def set_logo_dimensions
      if user_signed_in? && current_user.has_current_logos? && !params[:from_index_page]
        if @invoice.logo.to_s == current_user.display_logo.to_s && params[:invoice][:logo_width].present? && params[:invoice][:logo_height].present? && current_user.logos.present? && @invoice.valid?
          logo = current_user.current_logo

          logo.logo_width = params[:invoice][:logo_width].dup
          logo.logo_height = params[:invoice][:logo_height].dup
          logo.save

        end
      end
    end

    def format_invoice_type

      if params[:invoice][:invoice_type].present?
        invoice_type = params[:invoice][:invoice_type].dup
      else
        invoice_type = nil
      end

      if invoice_type.present?
        invoice_type.downcase!
        if Invoice::INVOICE_TYPES.include?(invoice_type)
          @invoice.invoice_type = invoice_type
        else
          @invoice.invoice_type = "invoice"
        end
      else
        if @invoice.is_estimate?
          @invoice.invoice_type = "estimate"
        else
          @invoice.invoice_type = "invoice"
        end
      end

    end

    def set_new_invoice_and_estimate_numbers
      if user_signed_in?
        @invoice.invoice_number = invoice_or_estimate_number("invoice")
        @invoice.estimate_number = invoice_or_estimate_number("estimate")
      end
    end

    def set_initial_invoice_type_by_url
      url = request.path_info
      if url.include?('estimates')
        @invoice.invoice_type = 'estimate'
      else
        @invoice.invoice_type = 'invoice'
      end
    end

    def set_relevant_invoice_or_estimate_number
      if @invoice.present?
        if @invoice.is_estimate?
          @invoice.invoice_number = invoice_or_estimate_number("invoice")
          @invoice.estimate_number ||= invoice_or_estimate_number("estimate")
        else
          @invoice.invoice_number ||= invoice_or_estimate_number("invoice")
          @invoice.estimate_number = invoice_or_estimate_number("estimate")
        end
      end
    end

    def invoice_or_estimate_path
      if @invoice.is_estimate?
        estimate_path(@invoice.estimate_number)
      else
        invoice_path(@invoice.invoice_number)
      end
    end

    def render_js_invoice_or_estimate_path
      if @invoice.is_estimate?
        render js: "window.location = '#{estimate_path(@invoice.estimate_number)}'"
      else
        render js: "window.location = '#{invoice_path(@invoice.invoice_number)}'"
      end
    end

    def back_to_index_page(temp_invoice = "")
      invoice = @invoice || temp_invoice || ""

      if invoice.present? && invoice.is_estimate?
        estimates_path
      else
        invoices_path
      end
    end


    def set_invoices_or_estimate_index_page
      if request.original_url.include? "estimates"
        @is_estimates = true
        @invoice_types = "Estimates"
        @invoices = @user_invoices.where("archived = ? AND invoice_type = ?", false, "estimate").page(params[:page])
        @invoices = @invoices.estimate_number(params[:estimate_number]) if params[:estimate_number].present?
      else
        @is_estimates = false
        @invoice_types = "Invoices"
        @invoices = @user_invoices.where("archived = ? AND invoice_type = ?", false, "invoice").page(params[:page])
        @invoices = @invoices.invoice_number(params[:invoice_number]) if params[:invoice_number].present?
        @invoices = @invoices.currently_due(params[:currently_due]) if params[:currently_due].present?
      end

       @invoices = @invoices.sorted_by(params[:sorted_by]) if params[:sorted_by].present?
       @invoices = @invoices.client_name(params[:client_name]) if params[:client_name].present?

    end

end
