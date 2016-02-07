class Job < ActiveRecord::Base
  belongs_to :invoice

  # Required Fields
  validates :job_description, presence: true, allow_blank: false

  validates :job_quantity, presence: true, 
	            numericality: { greater_than_or_equal_to: 0, message: "^Job quantity must be a number greater than or equal to 0", allow_blank: true }

  validates :job_rate, presence: true, 
	            numericality: { greater_than_or_equal_to: 0, message: "^ Job Description must be a number greater than or equal to $0.00", allow_blank: true }

  # Length
  validates :job_description, length: { maximum: 500 }
  validates :job_quantity, :job_rate, length: { maximum: 10 }

end
