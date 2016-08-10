class UserEmail < ApplicationRecord
  belongs_to :invoice
  belongs_to :user

  serialize :recipients

  def record_email_send(attributes = {})
  	recipients = attributes[:recipient].present? ? attributes[:recipient] : "No recipient"

  	if attributes[:cc].present?
  		cc = attributes[:cc].split(',')
  		cc.unshift recipients.to_s
  		recipients = cc
  	end

  	message = attributes[:message].present? ? attributes[:message] : "No message" 

  	self.recipients = recipients
  	self.message = message

  	puts "FIND THIS: #{recipients} :: #{message}"

  end
end
