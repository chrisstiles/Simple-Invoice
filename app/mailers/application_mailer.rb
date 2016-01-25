class ApplicationMailer < ActionMailer::Base
  default from: "noreply@invoiceapplication.com"
  add_template_helper(ApplicationHelper)
  layout 'mailer'
end
