class User < ActiveRecord::Base
	nilify_blanks
	
	has_many :invoices, dependent: :destroy
	has_many :clients, dependent: :destroy
	has_many :logos, dependent: :destroy

	# Carrierwave uploader
	#mount_uploader :logo, LogoUploader

	# Validations
	#validate :logo_size

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable, :confirmable


	# private

	# 	def logo_size
	# 		if logo.size > 5.megabytes
	# 			errors.add(:logo, "should be less than 5MB")
	# 		end
	# 	end

end
