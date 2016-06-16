class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.welcome.subject
  #
  def welcome(user)
  	@user = user
  	@from = "Simple Invoice <info@simpleinvoice.io>"
    mail from: @from, to: @user.email, subject: "Welcome to Simple Invoice"
  end
end
