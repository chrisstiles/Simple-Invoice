class UsersController < ApplicationController

	before_action :set_user

	def show
	end

	def edit
	end

	def update
		if @user.update(user_params)
			redirect_to @user
		end
	end

	private

		def set_user
			@user = current_user
		end

		def user_params
			params.require(:user).permit(:email, :name, :address_line1, :address_line2, :phone)
		end

end