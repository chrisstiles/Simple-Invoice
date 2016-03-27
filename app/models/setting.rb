class Setting < ActiveRecord::Base
	belongs_to :user

	validates :base_invoice_number, presence: true, 
	            numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 999999999, message: "^Base invoice number must be a number between 1 and 999,999,999", allow_blank: false }

	validates :tax, presence: true, 
	            numericality: { message: "^Tax % must be a number with no more than 10 digits", }

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
end
