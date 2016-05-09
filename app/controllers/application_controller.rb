class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :authenticate_user!
  before_action :get_users_browser#, only: [:show, :edit, :new, :index, :home]

  skip_before_action :authenticate_user!, if: lambda {

  	is_token = params[:token] && (request.original_url.include? "/pdfs/") && ("show".include? action_name)
  	is_creating_from_root = params[:creating_from_root]

  	if is_token || is_creating_from_root
  		true
  	else
  		false
  	end
  }

  around_filter :set_time_zone

  rescue_from CanCan::AccessDenied do |exception|
  	redirect_to main_app.root_path, :alert => exception.message
  end

  private

	  def get_module_name
	  	@module_name = self.class.name.split("::").first
	  end

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

	  def is_public_invoice_url
	  	if request.request_uri.include? "/pdfs/"
	  		print "URL: #{request.request_uri}"
	  		false
	  	else
	  		true
	  	end
	  end

	  def get_users_browser
	  	@browser = browser || ''
	  end
  
end
