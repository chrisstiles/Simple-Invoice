class User < ActiveRecord::Base
	nilify_blanks
	
	has_many :invoices, dependent: :destroy
	has_many :clients, dependent: :destroy
	has_many :logos, dependent: :destroy
	has_one :setting, dependent: :destroy

	accepts_nested_attributes_for :setting

	# Length
	validates :email, length: { maximum: 80 }
	validates :name, :email, :address, :city, :state, :zip, :phone, length: { maximum: 100 }

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable, :confirmable


	def display_logo
		unless self.logos.empty?
			self.logos.where(current_logo: true).first.image
		else
			''
		end
	end

end
