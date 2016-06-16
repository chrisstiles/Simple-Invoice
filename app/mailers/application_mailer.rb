class ApplicationMailer < ActionMailer::Base
  default from: "info@simpleinvoice.io"
  add_template_helper(ApplicationHelper)
  layout 'mailer'
end
