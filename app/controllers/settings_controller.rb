class SettingsController < ApplicationController
	before_action :authenticate_user!

	def update
		@setting = current_user.setting
		respond_to do |format|
			if @setting.update(setting_params)
				flash[:success] = 'Settings Updated!'
          		flash.keep(:success)
          		format.html
				format.js
			else
				format.html
				format.js
			end
		end
	end

	private

		def setting_params
			params.require(:setting).permit(:base_invoice_number)
		end

end