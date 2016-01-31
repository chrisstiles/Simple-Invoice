class InvoiceEmail
	include ActiveAttr::Model

	attribute :recipient
	attribute :cc
	attribute :message

	validates :recipient, presence: true, 
	            format: { with: /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i, multiline: true, 
		            		:message => Proc.new { |error, attributes| 
	                          "^#{attributes[:value]} is not a valid email" 
	                        }
	            } 

	# Ensure all cc emails are valid
	validate :check_cc_emails

	def check_cc_emails
		cc.split(/,\s*/).each do |email| 
	    	unless email =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
	    		errors.add(:cc, "^#{email} is not a valid email")
	    	end
	  	end
	end

	# Only allow a certain number of emails to be sent with CC
	validate :check_number_of_cc

	def check_number_of_cc
		num_cc = cc.split(/,\s*/).length
		if num_cc > 5
			errors.add(:cc, "^You can only CC. a maximum of 5 emails")
		end
	end

	# Length
	validates :recipient, length: { maximum: 80 }
	validates :cc, length: { maximum: 255 }
	validates :message, length: { maximum: 600 }

end