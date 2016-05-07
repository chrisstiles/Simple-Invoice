class LogosController < ApplicationController
	after_action :set_old_logos_not_current, only: [:create]
	#after_action :render_js_partial, only: [:create]

	def create
		@logo = current_user.logos.build(logo_params)

		respond_to do |format|
			if @logo.save
				format.html { redirect_to edit_user_path }
				format.js
				format.json { render json: @logo }
			else
				format.json { render json: { error: @logo.errors.full_messages.join(',') }, status: 400 }
			end
		end

	end

	def destroy
		remove_logo
		flash[:success] = 'Logo deleted!'
	    flash.keep(:success)

	    respond_to do |format|
	      format.html { redirect_to settings_path }
	      format.js { render js: "window.location = '#{settings_path}'" }
	    end
	end

	private

		def logo_params
			params.require(:logo).permit(:image)
		end

		def set_old_logos_not_current
			current_user.logos.where("id <> ?", @logo.id).update_all(current_logo: false)
		end

		def remove_logo
			current_user.current_logo.update_attribute(:current_logo, false)
		end

		def render_js_partial
			render js: "create.js.erb"
		end
end