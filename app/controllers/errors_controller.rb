class ErrorsController < ApplicationController
	before_action :authenticate_user!, :except => [:not_found, :internal_server_error]

	def not_found
		render(:status => 404)
	end

	def internal_server_error
		render(:status => 500)
	end
end