class Users::SessionsController < Devise::SessionsController
# before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    params[:user].merge!(remember_me: 1)
    resource = User.find_for_database_authentication(email: params[:user][:email])
    return invalid_login_attempt unless resource

    if resource.valid_password?(params[:user][:password])
      sign_in :user, resource
      @redirect_url = "#{stored_location_for(resource) || invoices_url}"
      return render 'create.js.erb'
    end

    invalid_login_attempt

    #super
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected

    def invalid_login_attempt
      set_flash_message(:alert, :invalid)
      render json: flash[:alert]
    end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
