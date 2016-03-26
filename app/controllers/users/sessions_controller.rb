class Users::SessionsController < Devise::SessionsController
# before_filter :configure_sign_in_params, only: [:create]
after_filter :set_csrf_headers, only: [:create, :destroy]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    params[:user].merge!(remember_me: 1)
    response.headers['X-CSRF-Token'] = form_authenticity_token
    super
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  protected

  def set_csrf_headers
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?  
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
