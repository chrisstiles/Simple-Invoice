class Invoice < ActiveRecord::Base
	before_validation :configure_invoice_type
	before_validation :set_invoice_or_estimate_number_blank

	before_save :set_balance
	before_save :set_client_name_if_needed
	

	# Relationships
	belongs_to :user
	belongs_to :client
	
	has_many :jobs, dependent: :destroy

	accepts_nested_attributes_for :jobs, :client

	before_create :generate_token

	# Number of invoices to show per page with pagination
	self.per_page = 9

	# Store number of jobs not to be deleted
	attr_accessor :num_jobs

##### Filtering
	default_scope { order(created_at: :desc) }

	scope :client_name, -> (client_name) { where("LOWER(client_name) like ?", "#{client_name.downcase}%")}
	scope :invoice_number, -> (invoice_number) { where("cast(invoice_number as text) like ?", "#{invoice_number.downcase}%")}
	scope :estimate_number, -> (estimate_number) { where("cast(estimate_number as text) like ?", "#{estimate_number.downcase}%")}
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
	  when /^estimate_number/
	    reorder("invoices.estimate_number #{ direction }")
	  else
	    raise(ArgumentError, "Invalid sort option: #{ sort_option.inspect }")
	  end
	}

##### Validations

	# Allowed types
	INVOICE_TYPES = ["invoice", "estimate"]

	validates_inclusion_of :invoice_type, in: INVOICE_TYPES,
 	message: "{{value}} is not a valid invoice type"

	# Required fields for both invoices and estimates
	validates :date, :name, :client_name, :total, presence: true, allow_blank: false

	# Required only for invoices, not estimates
	validates :due_date, presence: true, if: 'self.is_invoice?'

	# Total must be between 0 and 10,000,000
	validate :invoice_total_in_range

	def invoice_total_in_range
		unless (0..999999999).include?(self.total)
			errors.add(:total, "^Invoice total cannot exceed $999,999,999.00")
		end
	end

	# Invoice number uniqueness
	validates :invoice_number, uniqueness: { case_sensitive: false, scope: :user_id }, if: 'self.user.present? && self.is_invoice?'
	validates :estimate_number, uniqueness: { case_sensitive: false, scope: :user_id }, if: 'self.user.present? && self.is_estimate?'

	# Validation of numbers
	validates :invoice_number, :estimate_number, numericality: { greater_than: 0, message: "must be a number greater than zero", allow_blank: true }, if: 'self.user.present?'

	# Validation for home invoice
	validates :invoice_number, presence: true, 
	            numericality: { greater_than: 0, message: "^Invoice number must be a number greater than zero", allow_blank: false }, unless: 'self.user.present?'

	# Length
	validates :name, :date, :due_date, :address_line1, :address_line2, :phone, :client_name, :client_address_line1, :client_address_line1, length: { maximum: 255 }
	validates :total, length: { maximum: 25 }
	validates :invoice_number, length: { maximum: 15 }
	validates :notes, length: { maximum: 5000 }

	validate :amount_paid_less_than_or_equal_to_total

	def amount_paid_less_than_or_equal_to_total
	  if self.amount_paid && (Float(self.amount_paid) > Float(self.total))
	  	errors.add(:amount_paid, "cannot be greater than the invoice total")
	  elsif self.amount_paid.blank? || self.amount_paid.nil?
	  	errors.add(:amount_paid, "cannot be blank")

	  end
	end

	validates :tax, presence: true, 
	            numericality: { message: "^Tax % must be a number with no more than 10 digits" }

    validate :tax_only_max_digits

	def tax_only_max_digits
		number_of_digits = self.tax.to_s.gsub('.', '').length
		if self.tax == self.tax.floor
			if number_of_digits > 11
				errors.add(:tax, "^Tax % must be a number with no more than 10 digits")
			end
		else 
			if number_of_digits > 10
				errors.add(:tax, "^Tax % must be a number with no more than 10 digits")
			end
		end
	end


	# Validate number of jobs in the invoice

	validate :validate_number_of_jobs

	def validate_number_of_jobs

		num_jobs = self.num_jobs || self.jobs.count || 0

		if num_jobs <= 0 || num_jobs > 45
			errors.add(:jobs, "^Your invoice can only have a maximum of 45 jobs.")
		end
	end

	validates :logo_width, :logo_height, numericality: true, allow_blank: true

	def overdue?
		if self.due_date.future? || self.is_estimate? || self.paid_off?
			false
		else
			true
		end
	end

	def due_today?
		if self.due_date.today?
			true
		else
			false
		end
	end

	def set_balance
		if self.amount_paid >= 0
			self.balance = self.total - self.amount_paid
		else
			self.amount_paid = 0
			self.balance = self.total
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

	def tax_included_text
		if self.has_tax
			if self.tax_included
				'Included in total'
			else
				''
			end
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

	def generate_token
      self.token = SecureRandom.urlsafe_base64(16)
    end

    def set_client_name_if_needed
    	if self.client_name.blank?
    		unless self.client.present?
    			self.client_name = "Client"
    		else
    			if self.client.client_name.present?
    				self.client_name = self.client.client_name
    			else
    				self.client_name = "Client"
    			end
    		end
    	else
    		self.client_name = self.client_name.squish
    	end
    end

    def configure_invoice_type
    	invoice_type = self.invoice_type || "invoice"
    	invoice_type.downcase

    	unless INVOICE_TYPES.include?(invoice_type.to_s)
    		invoice_type = "invoice"
    	end
    	
    	self.invoice_type = invoice_type
    end

    def is_estimate?
    	if self.invoice_type.downcase == "estimate"
    		true
    	else
    		false
    	end
    end

    def is_invoice?
    	if self.invoice_type.downcase == "estimate"
    		false
    	else
    		true
    	end
    end

    def set_invoice_or_estimate_number_blank
    	if self.is_estimate?
    		self.invoice_number = ""
    		self.estimate_number = self.estimate_number.floor
    	else
    		self.estimate_number = ""
    		self.invoice_number = self.invoice_number.floor
    	end
    end

    def self.select_invoice_types
    	INVOICE_TYPES.map(&:capitalize)
    end

    def display_invoice_type
    	if self.is_estimate?
    		"Estimate"
    	else
    		"Invoice"
    	end
    end

    def display_number
    	if self.is_estimate?
    		self.estimate_number
    	else
    		self.invoice_number
    	end
    end

    def display_number_data_attribute
    	if self.is_estimate?
    		raw("data-estimatenumber='#{self.estimate_number}'")
    	else
    		raw("data-invoicenumber='#{self.invoice_number}'")
    	end
    end

    def terms
    	(self.due_date - self.date).to_i
    end

end
