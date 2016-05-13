class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :js
# before_filter :configure_sign_up_params, only: [:create]
# before_filter :configure_account_update_params, only: [:update]
  after_action :create_user_settings, only: [:create]
  after_action :add_homepage_invoice_to_user, only: [:create]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    super
    @user = resource
    if resource.save
      flash[:success] = 'Welcome to Simple Invoice!'
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  private

    def create_user_settings
      setting = Setting.create
      resource.setting = setting
    end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.for(:sign_up) << :attribute
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.for(:account_update) << :attribute
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end


  private

  def add_homepage_invoice_to_user
    if params[:homepage_token].present?
      invoice = Invoice.find_by(token: params[:homepage_token])

      if invoice.user.nil?
        invoice.user = @user
        invoice.save
      end      

    end
  end

end
