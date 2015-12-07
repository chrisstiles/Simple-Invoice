class User < ActiveRecord::Base
	nilify_blanks
	
	has_many :invoices
	has_many :clients

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	     :recoverable, :rememberable, :trackable, :validatable
end
