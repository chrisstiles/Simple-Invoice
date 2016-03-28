class UsersController < ApplicationController

	before_action :set_user
	before_action :authenticate_user!
	#before_action :normalize_blank_values

	def show
	end


	def edit
		@logo = Logo.new
		@setting = current_user.setting
	end

	def update
		respond_to do |format|
			if @user.update(user_params)
				flash[:success] = 'Profile successfully updated!'
          		flash.keep(:success)
				format.html { redirect_to edit_user_path }
				format.js
				format.json { render nothing: true, status: 200 }
			else
				format.js
				format.json { render nothing: true, status: 200 }
			end
		end
	end

	private

		def set_user
			@user = current_user
			@user_logo = current_user.display_logo if user_signed_in?
		end

		def user_params
			params.require(:user).permit(:email, :name, :address, :city, :state, :zip, :phone, :logo, setting_attributes: [:id, :base_invoice_number, :has_tax, :tax, :tax_included])
		end

		#def normalize_blank_values
		 # attributes.each do |column, value|
		 #   self[column].present? || self[column] = nil
		#  end
		#end

end