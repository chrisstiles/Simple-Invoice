class Job < ActiveRecord::Base
  belongs_to :invoice

  # Required Fields
  validates :job_description, presence: true, allow_blank: false

  validates :job_quantity, presence: true, 
	            numericality: { greater_than_or_equal_to: 0, message: "^Job quantity must be a number greater than or equal to 0", allow_blank: true }

  validates :job_rate, presence: true, 
	            numericality: { greater_than_or_equal_to: 0, message: "^ Job description must be a number greater than or equal to $0.00", allow_blank: true }

  # Length
  validates :job_description, length: { maximum: 500 }

  # Rate and Quantity below 1,000,000,000
  validate :total_in_range

  def total_in_range
    unless self.job_quantity.blank?
      check_total(self.job_quantity, "quantity")
    end
    unless self.job_rate.blank?
      check_total(self.job_rate, "rate")
    end
  end

  def check_total(number, name)
    unless (0..999999999).include?(number)
      if name == "quantity"
        errors.add(:job_quantity, "^Job quantity cannot exceed 999,999,999")
      else
        errors.add(:job_rate, "^Job rate cannot exceed $999,999,999.00")
      end
    end
  end

end
