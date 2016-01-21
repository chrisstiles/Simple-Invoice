class Client < ActiveRecord::Base
	belongs_to :user
	has_many :invoices

	validates :name, presence: true

	default_scope { order('LOWER(name) ASC') }
	scope :client_name, -> (client_name) { where("LOWER(name) like ?", "#{client_name.downcase}%")}

	# Number of clients to show per page with pagination.
	self.per_page = 5
	PER_PAGE = 5
end
