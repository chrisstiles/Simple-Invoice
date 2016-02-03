class Logo < ActiveRecord::Base
 	belongs_to :user

 	# Carrierwave uploader
	mount_uploader :image, LogoUploader

	# Validations
	validate :logo_size

	private

		def logo_size
			if image.size > 5.megabytes
				errors.add(:logo, "should be less than 5MB")
			end
		end

end
