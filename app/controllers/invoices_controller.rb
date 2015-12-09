class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :edit, :update, :destroy]
  after_action :remove_jobs_set_to_delete, only: [:update]

  def index
    @invoices = current_user.invoices.where(archived: false)
  end

  def show
    @editable = "false"
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "Invoice", :template => 'invoices/pdf_default.html.erb'
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
    @invoice.update_attribute(:invoice_number, set_invoice_number)
    
    set_client_if_not_nil
    
    @jobs = @invoice.jobs

    respond_to do |format|
      if @invoice.save
        format.html { redirect_to invoice_path(@invoice.invoice_number), notice: 'Invoice was successfully created.' }
        format.json { render :show, status: :created, location: @invoice }
      else
        format.html { render :new }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
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
        format.html { redirect_to invoice_path(@invoice.invoice_number), notice: 'Invoice was successfully updated.' }
        format.json { render :show, status: :ok, location: @invoice }
        format.js {  flash[:notice] = "Invoice was successfully updated." }
      else
        format.html { render :edit }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
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

end
