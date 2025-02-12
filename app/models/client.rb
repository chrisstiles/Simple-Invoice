class Client < ActiveRecord::Base
	belongs_to :user
	has_many :invoices, dependent: :nullify

	before_validation :remove_white_space

	# Validations

	# Required Fields
	validates :name, presence: true, allow_blank: false, uniqueness: { case_sensitive: false, scope: :user_id }
	validates :email, presence: true, 
	            format: { with: /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i, multiline: true,
	            :message => Proc.new { |error, attributes| 
	                          "^#{attributes[:value]} is not a valid email" 
	                        }
	             }, 
	            uniqueness: { case_sensitive: false, scope: :user_id }

	# Length
	validates :email, length: { maximum: 80 }
	validates :name, :email, :address, :city, :state, :zip, :phone, length: { maximum: 100 }

	default_scope { order('LOWER(name) ASC') }
	scope :client_name, -> (client_name) { where("LOWER(name) like ?", "#{client_name.downcase}%")}

	# Number of clients to show per page with pagination. return to 10 
	self.per_page = 6
	PER_PAGE = 6

	private

		def remove_white_space
			self.name = self.name.squish
		end

end
