class LogosController < ApplicationController
	after_action :set_old_logos_not_current, only: [:create]

	def create
		@logo = current_user.logos.build(logo_params)

		respond_to do |format|
			if @logo.save
				format.html { redirect_to edit_user_path }
				format.js
				format.json { render nothing: true, status: 200 }
			end
		end

	end

	def destroy
	end

	private

		def logo_params
			params.require(:logo).permit(:image)
		end

		def set_old_logos_not_current
			current_user.logos.where("id <> ?", @logo.id).update_all(current_logo: false)
		end
end