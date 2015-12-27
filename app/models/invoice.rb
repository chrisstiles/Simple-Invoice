class Invoice < ActiveRecord::Base
	belongs_to :user
	belongs_to :client
	
	has_many :jobs
	accepts_nested_attributes_for :jobs, :client

	# Validations

	# Required Fields
	validates :invoice_number, :date, :due_date, :name, :client_name, :total, presence: true, allow_blank: false

	# Length
	validates :name, :date, :due_date, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line1, length: { maximum: 255 }
	validates :total, length: { maximum: 25 }
	validates :notes, length: { maximum: 5000 }

	validate :amount_paid_less_than_or_equal_to_total

	def amount_paid_less_than_or_equal_to_total
	  if self.amount_paid && (self.amount_paid >= self.total)
	  	errors.add(:amount_paid, "Amount Paid cannot be greater than the invoice total")
	  end
	end


	# Is overdue? method
	def overdue?
		if self.due_date.future?
			false
		else
			true
		end
	end

end
