class InvoiceMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invoice_mailer.email_invoice.subject
  #
  def email_invoice(invoice)
  	@invoice = invoice

  	attachments["invoice.pdf"] = WickedPdf.new.pdf_from_string(
    	render_to_string(:pdf => "invoice",:template => 'invoices/pdf_default.html.erb')
  	)


    @greeting = "Invoice Number: #{@invoice.invoice_number}"

    self.instance_variable_set(:@_lookup_context, nil)
  	mail :subject => "Your Invoice", :to => "chris_stiles015@yahoo.com"
  	
  end
end
