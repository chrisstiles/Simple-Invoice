class InvoicesController < ApplicationController
  before_action :set_invoice, only: [:show, :edit, :update, :destroy]
  after_action :remove_jobs_set_to_delete, only: [:update]
  

  # GET /invoices
  # GET /invoices.json
  def index
    @invoices = Invoice.where(archived: false)
  end

  # GET /invoices/1
  # GET /invoices/1.json
  def show
    @editable = "false"
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "file_name", :template => 'invoices/pdf_show.html.erb'   # Excluding ".pdf" extension.
      end
    end
  end

  # GET /invoices/new
  def new
    @editable = "true"
    @invoice = Invoice.new
    @number = set_invoice_number

    @invoice.jobs.build
  end

  # GET /invoices/1/edit
  def edit
    @editable = "true"
  end

  # POST /invoices
  # POST /invoices.json
  def create
    @invoice = Invoice.new(invoice_params)
    @invoice.invoice_number = set_invoice_number
    @jobs = @invoice.jobs
   # @invoice.jobs.each do |job|
   #     job.job_quantity.round(2)
   #     job.job_rate.round(2)
   # end
    respond_to do |format|
      if @invoice.save
        format.html { redirect_to @invoice, notice: 'Invoice was successfully created.' }
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
    respond_to do |format|
      if @invoice.update(invoice_params)
        format.html { redirect_to @invoice, notice: 'Invoice was successfully updated.' }
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
      @invoice = Invoice.find(params[:id])
    end

    def invoice_params
      params.require(:invoice).permit(:invoice_number, :terms, :date, :due_date, :name, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line2, :notes, :total, jobs_attributes: [ :id, :job_description, :job_quantity, :job_rate, :will_delete ])
    end

    def set_invoice_number
      Invoice.count + 1
    end

    def archive_invoice
      @invoice.update_attribute(:archived, true)
    end

    def remove_jobs_set_to_delete
      Job.where(will_delete: true).destroy_all
    end

end
