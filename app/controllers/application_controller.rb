class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :authenticate_user!

  around_filter :set_time_zone
                                                                                 
	private
	                                                                             
		def set_time_zone
			old_time_zone = Time.zone
			Time.zone = browser_timezone if browser_timezone.present?
			yield
		ensure
			Time.zone = old_time_zone
		end
	                                                                             
		def browser_timezone
			cookies["browser.timezone"]
		end
  
end
