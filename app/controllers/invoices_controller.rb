class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :edit, :update, :destroy, :email_invoice]
  #before_action :set_number_of_jobs_not_to_be_deleted, only: [:create, :update]
  after_action :merge_client_if_name_exists, only: [:create, :update]
  after_action :remove_jobs_set_to_delete, only: [:create, :update]
  after_action :set_invoice_balance, only: [:update]
  before_action :authenticate_user!

  def index
   @invoices = current_user.invoices.where(archived: false).page(params[:page])

   @invoices = @invoices.sorted_by(params[:sorted_by]) if params[:sorted_by].present?
   @invoices = @invoices.client_name(params[:client_name]) if params[:client_name].present?
   @invoices = @invoices.invoice_number(params[:invoice_number]) if params[:invoice_number].present?
   @invoices = @invoices.currently_due(params[:currently_due]) if params[:currently_due].present?

  end

  def show
    @editable = "false"
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "Invoice #{@invoice.invoice_number}", :template => 'invoices/pdf_default.html.erb'
      end
    end
  end

  def email_invoice

    if request.format.js?

      @email = InvoiceEmail.new(params)

      if @email.valid?
        puts "Valid Email!"

        InvoiceMailer.email_invoice(@invoice, params[:recipient], params[:cc], params[:message], current_user.email).deliver_now

        flash[:success] = 'Invoice was successfully emailed!'
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

    @editable = "true"
    @number = set_invoice_number

    @invoice.jobs.build
  end

  def edit
    @editable = "true"
  end


  def create
    @invoice = current_user.invoices.build(invoice_params)
    @invoice.invoice_number = set_invoice_number
    set_initial_balance

    @editable = "true"
    
    set_client_if_not_nil
    set_number_of_jobs_not_to_be_deleted
    #@jobs = @invoice.jobs

    respond_to do |format|

      if @invoice.save
        #merge_client_if_name_exists
        format.html { redirect_to invoice_path(@invoice.invoice_number), flash: { success: 'Invoice was successfully created!' } }
        format.json { render :show, status: :ok, location: @invoice }

        flash[:success] = 'Invoice was successfully created!'
        flash.keep(:success)

        format.js { render js: "window.location = '#{invoice_url(@invoice.invoice_number)}'" }

        format.html { render invoice_path(@invoice.invoice_number) }
      else
        format.html { render :new }
        format.js 
      end

    end
    
  end

  # PATCH/PUT /invoices/1
  # PATCH/PUT /invoices/1.json
  def update
    #@invoice.jobs.each do |job|
    #    job.job_quantity.round(2)
    #    job.job_rate.round(2)
    #end
    #@jobs = @invoice.jobs

    set_client_if_not_nil
    set_number_of_jobs_not_to_be_deleted
    #set_invoice_balance

    respond_to do |format|
      if @invoice.update(invoice_params)
        #merge_client_if_name_exists
        format.html { redirect_to invoice_url(@invoice.invoice_number), flash: { success: 'Payment Recorded!' } }
        format.json { render :show, status: :ok, location: @invoice }

        if params[:invoice][:amount_paid].present?
          flash[:success] = 'Payment Recorded!'
          flash.keep(:success)
        else
          flash[:success] = 'Invoice was successfully updated!'
          flash.keep(:success)
        end

        if params[:from_index_page]
          format.js #{ render js: "window.location = '#{invoices_path}'" }
        else
          format.js { render js: "window.location = '#{invoice_path(@invoice.invoice_number)}'" }
        end
        
      else
        format.html { render :show }
        format.js 
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    archive_invoice
    flash[:success] = 'Invoice deleted!'
    flash.keep(:success)

    respond_to do |format|
      format.js { render js: "window.location = '#{invoices_path}'" }
    end
  end

  private
   
    def set_invoice
      @invoice = current_user.invoices.find_by(invoice_number: params[:invoice_number])

      if @invoice && @invoice.archived
        @invoice = nil
      end

    end

    def invoice_params
      params.require(:invoice).permit(:terms, :logo, :date, :due_date, :name, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line2, :client_id, :notes, :amount_paid, :total, :numjobs, jobs_attributes: [ :id, :job_description, :job_quantity, :job_rate, :will_delete ])
    end

    # def email_invoice_params
    #   params.permit(:recipient, :cc, :message)
    # end

    def set_invoice_number
      base_invoice_number = current_user.setting.base_invoice_number
      max_current_invoice_number = current_user.invoices.maximum("invoice_number") || 0

      if current_user.invoices.empty?
        return 1
      end

      if base_invoice_number > max_current_invoice_number
        return base_invoice_number
      elsif base_invoice_number == max_current_invoice_number
        return base_invoice_number + 1
      end

      if base_invoice_number < max_current_invoice_number
        used_invoice_numbers = current_user.invoices.where("invoice_number >= ?", base_invoice_number).pluck(:invoice_number).sort

        for num in base_invoice_number..max_current_invoice_number
          unless used_invoice_numbers.include?(num)
            puts "#{num}"
            return num
          end
        end
      end

      max_current_invoice_number + 1
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

      @invoice.num_jobs = num_jobs

    end

    def set_client_if_not_nil
      if params.include?(:client_id)
        client_id = params[:client_id]
        unless client_id.empty?
           @invoice.client = current_user.clients.find(params[:client_id])
        else
          @invoice.client = nil
        end
      end
    end

   def merge_client_if_name_exists
      client_id = @invoice.client_id
      client_name = @invoice.client_name
      client = current_user.clients.where('lower(name) = ?', client_name.downcase).first
      #client = current_user.clients.find_by(name: client_name)
      unless client.nil?
        @invoice.client_name = client.name
      end
      @invoice.client = client
      @invoice.save
   end

    def set_initial_balance
      @invoice.balance = @invoice.total
      @invoice.amount_paid = 0
    end

    def set_invoice_balance
      if @invoice.amount_paid.present? && @invoice.amount_paid > 0
        @invoice.balance = @invoice.total - @invoice.amount_paid
      else
        @invoice.amount_paid = 0
        @invoice.balance = @invoice.total
      end
    end

end
