class User < ActiveRecord::Base
	nilify_blanks
	
	has_many :invoices, dependent: :destroy
	has_many :clients, dependent: :destroy
	has_many :logos, dependent: :destroy
	has_one :setting, dependent: :destroy

	accepts_nested_attributes_for :setting

	# Remember user by default
	def remember_me
		true
	end

	def is_admin?
		puts self.is_admin
		if self.is_admin == true
			true
		else
			false
		end
	end

	# Length
	validates :email, length: { maximum: 80 }
	validates :name, :email, :address, :city, :state, :zip, :phone, length: { maximum: 100 }

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable


	def has_current_logos?
	    if self.logos.empty?
	      false
	    elsif self.logos.where(current_logo: true).first.nil?
	      false
	    else
	      true
	    end
    end


	def display_logo
		unless self.logos.empty?
			logo = self.logos.where(current_logo: true).first
			unless logo.nil?
				logo.image
			else
				''
			end
		else
			''
		end
	end

	def display_logo_url
		unless self.logos.empty?
			logo = self.logos.where(current_logo: true).first
			unless logo.nil?
				logo.image.url
			else
				''
			end
		else
			''
		end
	end

	def current_logo
		unless self.logos.empty?
			logo = self.logos.where(current_logo: true).first
			unless logo.nil?
				logo
			else
				''
			end
		else
			''
		end
	end

end
