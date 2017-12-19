class ContactMailer < ApplicationMailer

  def contact_form(name, message, email, user)
  	@name = name
  	@message = message
  	@email = email

  	if user.present? && user.id.present?
  		@user_id = "User signed in. ID: #{user.id}"
  	else
  		@user_id = "User not signed in"
  	end

  	mail subject: "Simple Invoice Contact Form", to: "info@simpleinvoice.io", reply_to: @email
  end
  
end
