class InvoiceMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invoice_mailer.email_invoice.subject
  #
  def email_invoice(user, invoice, recipient, cc, subject, message)
  	@invoice = invoice
    @from = user.email_from_address #user.email || "noreply@simpleinvoice.com"
    @recipient = recipient
    @cc = cc.split(",")
    @subject = subject
    @message = message

  	attachments["#{@invoice.invoice_type}_#{@invoice.display_number}.pdf"] = WickedPdf.new.pdf_from_string(
    	render_to_string(pdf: "#{@invoice.invoice_type}#{@invoice.display_number}", template: 'invoices/pdf_default.html.erb')
  	)

    self.instance_variable_set(:@_lookup_context, nil)
  	mail from: @from, subject: @subject, to: @recipient, cc: @cc
  	
  end
end
