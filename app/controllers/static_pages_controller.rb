class StaticPagesController < ApplicationController
	before_action :redirect_if_logged_in, only: [:home]
	before_action :authenticate_user!, :except => [:home, :no_invoice_found, :contact, :send_contact]

	def home
		@invoice = Invoice.new
		@invoice.jobs.build
	end

	def contact
	end

	def send_contact
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
