class Invoice < ActiveRecord::Base
	# Relationships
	belongs_to :user
	belongs_to :client
	
	has_many :jobs
	accepts_nested_attributes_for :jobs, :client

	# Number of invoices to show per page with pagination
	self.per_page = 9

	# Store number of jobs not to be deleted
	attr_accessor :num_jobs

	# Filtering
	default_scope { order(created_at: :desc) }

	scope :client_name, -> (client_name) { where("LOWER(client_name) like ?", "#{client_name.downcase}%")}
	scope :invoice_number, -> (invoice_number) { where("cast(invoice_number as text) like ?", "#{invoice_number.downcase}%")}
	scope :currently_due, -> (currently_due) {
		if currently_due 
			where("due_date <= ?", Date.today).where("balance > ?", 0)
		end
		#here("client_name like ?", "VendCentral")
	}

	scope :sorted_by, -> (sort_option) { 
	  # extract the sort direction from the param value.
	  direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
	  case sort_option.to_s
	  when /^created_at_/
	    reorder("invoices.created_at #{ direction }")
	  when /^client_name_/
	    reorder("LOWER(invoices.client_name) #{ direction }")
	  when /^invoice_number/
	    reorder("invoices.invoice_number #{ direction }")
	  else
	    raise(ArgumentError, "Invalid sort option: #{ sort_option.inspect }")
	  end
	}

	# Validations

	# Required Fields
	validates :invoice_number, :date, :due_date, :name, :client_name, :total, presence: true, allow_blank: false

	# Invoice Number Uniqueness
	validates :invoice_number, uniqueness: { case_sensitive: false, scope: :user_id }

	# Length
	validates :name, :date, :due_date, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line1, length: { maximum: 255 }
	validates :total, length: { maximum: 25 }
	validates :notes, length: { maximum: 5000 }

	validate :amount_paid_less_than_or_equal_to_total

	def amount_paid_less_than_or_equal_to_total
	  if self.amount_paid && (Float(self.amount_paid) > Float(self.total))
	  	errors.add(:amount_paid, "cannot be greater than the invoice total")
	  end
	end


	# Validate number of jobs in the invoice

	validate :validate_number_of_jobs

	def validate_number_of_jobs
		num_jobs = self.num_jobs || 1
		errors.add(:jobs, "^Your invoice can only have a maximum of 45 jobs.") if num_jobs > 45
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
		if self.total - self.amount_paid <= 0
			true
		else
			false
		end
	end

	def not_paid_off?
		if self.total - self.amount_paid > 0 
			true
		else
			false
		end
	end

	def invoice_status_class

		if self.paid_off?
			'paidinfull'
		elsif self.overdue?
			'overdue'
		else
			''
		end
			
	end

	include ActionView::Helpers::TextHelper

	def print_days_until_due
		if self.total - self.amount_paid > 0
			if self.due_date > Time.zone.today
				days = pluralize((self.due_date - Time.zone.today).to_i, 'day')
				raw("Due in: <strong>#{days}</strong>")
			elsif self.due_date == Time.zone.today
				raw("<strong class='overdue'>Due today</strong>")
			else self.due_date < Time.zone.today
				days = pluralize((Time.zone.today - self.due_date).to_i, 'day')
				raw("<span class='overdue'>Overdue by: <strong>#{days}</strong></span>")
			end
		else
			raw("<span class='paidinfull'>Paid in full</span>")
		end
	end

end
