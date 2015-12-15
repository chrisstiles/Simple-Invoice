class Client < ActiveRecord::Base
	belongs_to :user
	has_many :invoices

	validates :name, presence: true
end
