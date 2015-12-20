class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :edit, :update, :destroy]
  after_action :merge_client_if_name_exists, only: [:create, :update]
  after_action :remove_jobs_set_to_delete, only: [:create, :update]

  def index
    @invoices = current_user.invoices.where(archived: false)
    @total_due = return_total_amount_currently_due
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
    
    @jobs = @invoice.jobs

    respond_to do |format|

      if @invoice.save
        #merge_client_if_name_exists
        format.html { redirect_to invoice_path(@invoice.invoice_number), flash: { success: 'Invoice was successfully created!' } }
        format.json { render :show, status: :ok, location: @invoice }

        flash[:success] = 'Invoice was successfully created!'
        flash.keep(:success)
        format.js { render js: "window.location = '#{invoice_path(@invoice.invoice_number)}'" }

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
    @jobs = @invoice.jobs

    set_client_if_not_nil

    respond_to do |format|
      if @invoice.update(invoice_params)
        #merge_client_if_name_exists
        format.html { redirect_to invoice_path(@invoice.invoice_number), flash: { success: 'Invoice was successfully updated!' } }
        format.json { render :show, status: :ok, location: @invoice }

        flash[:success] = 'Invoice was successfully updated!'
        flash.keep(:success)
        format.js { render js: "window.location = '#{invoice_path(@invoice.invoice_number)}'" }
      else
        format.html { render :edit }
        format.js 
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    archive_invoice
    respond_to do |format|
      format.html { redirect_to invoices_url, notice: 'Invoice was successfully destroyed.' }
      format.json { head :no_content }
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
      params.require(:invoice).permit(:terms, :date, :due_date, :name, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line2, :client_id, :notes, :total, jobs_attributes: [ :id, :job_description, :job_quantity, :job_rate, :will_delete ])
    end

    def set_invoice_number
      current_user.invoices.count + 1
    end

    def archive_invoice
      @invoice.update_attribute(:archived, true)
    end

    def remove_jobs_set_to_delete
      @invoice.jobs.where(will_delete: true).destroy_all
    end

    def set_client_if_not_nil
      client_id = params[:client_id]
      unless client_id.empty?
         @invoice.client = current_user.clients.find(params[:client_id])
      else
        @invoice.client = nil
      end
    end

   def merge_client_if_name_exists
      client_id = @invoice.client_id
      client_name = @invoice.client_name
      client = current_user.clients.find_by(name: client_name)
      @invoice.client = client
      @invoice.save
   end

    def return_total_amount_currently_due
      total_due = 0

      @invoices.each do |invoice|
        unless invoice.due_date.future?
          total_due += invoice.total.to_f
        end
      end

      total_due
      
    end

    def set_initial_balance
      @invoice.balance = @invoice.total
    end


end
