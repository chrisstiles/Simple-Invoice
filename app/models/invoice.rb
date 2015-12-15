class Invoice < ActiveRecord::Base
	belongs_to :user
	belongs_to :client
	
	has_many :jobs
	accepts_nested_attributes_for :jobs, :client

	# Validations

	# Required Fields
	validates :invoice_number, :date, :due_date, :name, :client_name, :total, presence: true, allow_blank: false


	# Is overdue? method
	def overdue?
		if self.due_date.future?
			false
		else
			true
		end
	end

end
