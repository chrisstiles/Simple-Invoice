Rails.application.routes.draw do
  match '*path', via: :all, to: 'errors#not_found',
      constraints: CloudfrontConstraint.new
  
  get 'errors/not_found'

  get 'errors/internal_server_error'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  # Skip routes for devise and specify custom controllers
  devise_for :users,
  controllers: { sessions: "users/sessions", registrations: "users/registrations", passwords: "users/passwords" },
  path: '',
  skip: [:registrations, :sessions]

  # Add in custom routes for the ones previously skipped
  as :user do
    # Registration routes
    post 'users/:id' => 'users/registrations#create', as: :registration
    get 'register' => 'devise/registrations#new', as: :register

    # Session routes
    get 'sign-in' => 'users/sessions#new', as: :sign_in
    post 'sign-in' => 'users/sessions#create', as: :user_session
    delete 'sign_out' => 'users/sessions#destroy'

    get "forgot-password", to: "users/passwords#new", as: :forgot_password
  end

  get 'pdfs/no-invoice-found' => 'static_pages#no_invoice_found', as: :no_invoice_found

  get '/contact' => 'static_pages#contact', as: :contact
  post '/contact' => 'static_pages#send_contact', as: :send_contact

  get '/about' => 'static_pages#about', as: :about

  get '/privacy_policy' => 'static_pages#privacy_policy', as: :privacy_policy

  root 'static_pages#home'

  patch '/invoices/:invoice_number' => 'invoices#update', as: :update_invoice
  resources :invoices, param: :invoice_number

  patch '/estimates/:estimate_number' => 'invoices#update', as: :update_estimate
  get '/estimates/new' => 'invoices#new', as: :new_estimate
  resources :estimates, param: :estimate_number, controller: 'invoices', except: [:new]

  # Email Invoice and Estimate
  post 'invoices/:invoice_number/send' => 'invoices#email_invoice', as: :send_email_invoice
  get 'invoices/:invoice_number/send' => 'invoices#email_invoice', as: :show_email_invoice

  post 'estimates/:estimate_number/send' => 'invoices#email_invoice', as: :send_email_estimate
  get 'estimates/:estimate_number/send' => 'invoices#email_invoice', as: :show_email_estimate

  # Public URL for PDF
  get '/pdfs/:token' => 'invoices#show', param: :token, :defaults => { :format => :pdf }, as: :public_invoice

  # User's profile and settings
  resources :users, only: [:update]
  get '/settings' => 'users#edit', as: :settings
  resources :settings, only: [:update]

  # Clients
  resources :clients, except: [:new, :show]

  # Logos
  resources :logos, only: [:create, :destroy]

  # Error pages
  match "/404", :to => "errors#not_found", :via => :all
  match "/500", :to => "errors#internal_server_error", :via => :all

end
