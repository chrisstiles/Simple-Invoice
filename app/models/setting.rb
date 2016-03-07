class Setting < ActiveRecord::Base
  belongs_to :user

  validates :base_invoice_number, presence: true, 
	            numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 999999999, message: "^Base invoice number must be a number between 1 and 999,999,999", allow_blank: false }

end
