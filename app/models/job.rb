class Job < ActiveRecord::Base
  belongs_to :invoice

  # Required Fields
  validates :job_description, :job_quantity, :job_rate, presence: true, allow_blank: false

  # Must be numbers
  validates :job_quantity, numericality: { greater_than_or_equal_to: 0, message: "must be a number greater than or equal to 0" }
  validates :job_rate, numericality: { greater_than_or_equal_to: 0, message: "must be a number greater than or equal to $0.00" }

  # Length
  validates :job_description, length: { maximum: 500 }
  validates :job_quantity, :job_rate, length: { maximum: 30 }

end
