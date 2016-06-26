class StaticPagesController < ApplicationController
	before_action :redirect_if_logged_in, only: [:home]
	before_action :authenticate_user!, :except => [:home, :no_invoice_found, :contact, :send_contact, :about]

	def home
		@invoice = Invoice.new
		@invoice.jobs.build
	end

	def contact
		@email = ContactEmail.new
	end

	def send_contact
		if request.format.js?
			@email = ContactEmail.new(params[:contact_email])
			if @email.valid?

				if user_signed_in?
					@user = current_user
				else
					@user = nil
				end

				ContactMailer.contact_form(params[:contact_email][:name], params[:contact_email][:message], params[:contact_email][:email], @user).deliver_now
				flash[:success] = "Submission successful!"
				flash.keep(:success)
			end
		end

		respond_to do |format|
      		format.js
   	 	end
	end

	def about
	end

	def no_invoice_found
	end

	private
		def redirect_if_logged_in
			if user_signed_in?
				redirect_to invoices_path
			end
		end
end
