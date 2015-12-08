class Invoice < ActiveRecord::Base
	belongs_to :user
	belongs_to :client
	
	has_many :jobs
	accepts_nested_attributes_for :jobs, :client

end
