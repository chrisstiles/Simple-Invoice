class Invoice < ActiveRecord::Base
	# Relationships
	belongs_to :user
	belongs_to :client
	
	has_many :jobs
	accepts_nested_attributes_for :jobs, :client

	# Number of invoices to show per page with pagination
	self.per_page = 5

	# Filtering
	scope :client_name, -> (client_name) { where("LOWER(client_name) like ?", "#{client_name.downcase}%")}
	scope :invoice_number, -> (invoice_number) { where("cast(invoice_number as text) like ?", "#{invoice_number.downcase}%")}
	scope :currently_due, -> (currently_due) {
		if currently_due 
			where("due_date <= ?", Date.today).where("balance > ?", 0)
		end
		#here("client_name like ?", "VendCentral")
	}

	# Validations

	# Required Fields
	validates :invoice_number, :date, :due_date, :name, :client_name, :total, presence: true, allow_blank: false

	# Length
	validates :name, :date, :due_date, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line1, length: { maximum: 255 }
	validates :total, length: { maximum: 25 }
	validates :notes, length: { maximum: 5000 }

	validate :amount_paid_less_than_or_equal_to_total

	def amount_paid_less_than_or_equal_to_total
	  if self.amount_paid && (Float(self.amount_paid) > Float(self.total))
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

	def paid_off?
		if self.balance <= 0
			true
		else
			false
		end
	end

	def not_paid_off?
		if self.balance > 0 
			true
		else
			false
		end
	end

end
