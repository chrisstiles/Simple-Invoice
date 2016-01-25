class InvoiceMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.invoice_mailer.email_invoice.subject
  #
  def email_invoice(invoice)
  	@invoice = invoice

    @greeting = "Invoice Number: #{@invoice.invoice_number}"

    mail to: "chris_stiles015@yahoo.com"
  end
end
