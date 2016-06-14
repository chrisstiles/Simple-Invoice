class ContactEmail
	include ActiveAttr::Model

	attribute :name
	attribute :email
	attribute :message

	validates :email, presence: true, 
	            format: { with: /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i, multiline: true, 
		            		:message => Proc.new { |error, attributes| 
	                          "^#{attributes[:value]} is not a valid email" 
	                        }
	            } 

	validates :message, presence: true

	validates :name, :email, length: { maximum: 80 }
	validates :message, length: { maximum: 600 }


end