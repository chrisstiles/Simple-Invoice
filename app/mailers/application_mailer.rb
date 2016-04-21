class ApplicationMailer < ActionMailer::Base
  default from: "noreply@simpleinvoice.io"
  add_template_helper(ApplicationHelper)
  layout 'mailer'
end
