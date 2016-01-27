class InvoiceMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invoice_mailer.email_invoice.subject
  #
  def email_invoice(invoice, recipient, cc, message)
  	@invoice = invoice
    @recipient = recipient
    @cc = cc.split(",")
    @message = message

  	attachments["invoice_#{@invoice.invoice_number}.pdf"] = WickedPdf.new.pdf_from_string(
    	render_to_string(:pdf => "invoice_#{@invoice.invoice_number}", :template => 'invoices/pdf_default.html.erb')
  	)


    self.instance_variable_set(:@_lookup_context, nil)
  	mail :subject => "Your Invoice", :to => @recipient, :cc => @cc
  	
  end
end
