class InvoiceMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invoice_mailer.email_invoice.subject
  #
  def email_invoice(user, invoice, recipient, cc, subject, message)
  	@invoice = invoice
    #user.email_from_address
    @from =  "#{user.proper_name} <info@simpleinvoice.com>"
    @reply_to = user.email || "info@simpleinvoice.io"
    @recipient = recipient
    @cc = cc.split(",")
    @subject = subject
    @message = message

  	attachments["#{@invoice.invoice_type}_#{@invoice.display_number}.pdf"] = WickedPdf.new.pdf_from_string(
    	render_to_string(pdf: "#{@invoice.invoice_type}#{@invoice.display_number}", template: 'invoices/pdf_default.html.erb')
  	)

    self.instance_variable_set(:@_lookup_context, nil)
  	mail from: @from, subject: @subject, to: @recipient, cc: @cc, reply_to: @reply_to
  	
  end
end
