class Client < ActiveRecord::Base
	belongs_to :user
	has_many :invoices

	# Validations

	# Required Fields
	validates :name, presence: true, allow_blank: false, uniqueness: { case_sensitive: false, scope: :user_id }
	validates :email, presence: true, 
	            format: { with: /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i, multiline: true }, 
	            uniqueness: { case_sensitive: false, scope: :user_id }

	# Length
	validates :name, :email, :address, :city, :state, :zip, :phone, length: { maximum: 255 }

	default_scope { order('LOWER(name) ASC') }
	scope :client_name, -> (client_name) { where("LOWER(name) like ?", "#{client_name.downcase}%")}

	# Number of clients to show per page with pagination.
	self.per_page = 10
	PER_PAGE = 10
end
