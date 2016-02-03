class UsersController < ApplicationController

	before_action :set_user
	#before_action :normalize_blank_values

	def show
	end

	def edit
		@logo = Logo.new
	end

	def update
		respond_to do |format|
			if @user.update(user_params)
				format.html { redirect_to edit_user_path }
				format.js
				format.json { render nothing: true, status: 200 }
			end
		end
	end

	private

		def set_user
			@user = current_user
			@user_logo = @user.logos.where(current_logo: true).first.image unless @user.logos.empty?
		end

		def user_params
			params.require(:user).permit(:email, :name, :address, :city, :state, :zip, :phone, :logo)
		end


		#def normalize_blank_values
		 # attributes.each do |column, value|
		 #   self[column].present? || self[column] = nil
		#  end
		#end

end