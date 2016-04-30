Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  #devise_for :users

  devise_for :users, controllers: { sessions: "users/sessions", except: [:new], registrations: "users/registrations" }
  
 # get '/invoices/new' => 'invoices#new', as: :new_invoice
 # post '/invoices' => 'invoices#create'
 # get '/invoices/:invoice_number' => 'invoices#show', as: :invoice
 # get '/invoices/:invoice_number/edit' => 'invoices#edit', as: :edit_invoice
  #patch '/invoices/:invoice_number' => 'invoices#update'

  # authenticated :user do
  #   root 'invoices#index', as: :authenticated_root
  # end  

  root 'static_pages#home'

  patch '/invoices/:invoice_number' => 'invoices#update', as: :update_invoice
  resources :invoices, param: :invoice_number

  # Email Invoice
  post 'invoices/:invoice_number/send' => 'invoices#email_invoice', as: :send_email_invoice
  get 'invoices/:invoice_number/send' => 'invoices#email_invoice', as: :show_email_invoice

  get '/pdfs/:token' => 'invoices#show', param: :token, :defaults => { :format => :pdf }, as: :public_invoice

  resources :users, only: [:show, :update]

  get '/settings' => 'users#edit', as: :settings

  resources :clients, except: [:new]

  resources :logos, only: [:create, :destroy]

  resources :settings, only: [:update]


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
 

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
