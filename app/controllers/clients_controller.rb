class ClientsController < ApplicationController
	before_action :set_client, only: [:show, :edit, :update, :destroy]
	after_action :set_non_primary_clients_to_false, only: [:create, :update]

	def index
		@clients = current_user.clients.page(params[:page])
		@clients = @clients.client_name(params[:client_name]) if params[:client_name].present?
		@client = Client.new

		respond_to do |format|
			format.html
			format.json { render json: @clients }
			format.js
		end

	end

	def show
	end

	def new
		@client = Client.new
	end

	def create
		@client = current_user.clients.build(client_params)
		respond_to do |format|
			if @client.save
				flash[:success] = 'Client was successfully created!'
          		flash.keep(:success)
          		@clients = current_user.clients.page(params[:page])
          		@client_id = @client.id
          		@pagination_page = return_client_page_pagination(@client)
          		@per_page = Client::PER_PAGE
          		@clients_count = current_user.clients.count
				format.js
			else
				format.js
			end
		end
	end

	def edit
		respond_to do |format|
			format.html
			format.js
		end
	end

	def update
		respond_to do |format|
			if @client.update(client_params)
				flash[:success] = 'Client Updated!'
          		flash.keep(:success)
				format.js
			else
				format.js
			end
		end
	end

	def destroy
	end

	private

		def set_client
			@client = current_user.clients.find(params[:id])
		end

		def client_params
			params.require(:client).permit(:name, :email, :address, :city, :state, :zip, :phone, :is_primary)
		end

		def set_non_primary_clients_to_false
			if params[:client][:is_primary] == "1"
				current_user.clients.where("id <> ?", @client.id).update_all(is_primary: false)
			else 
				puts "IT WAS FALSE"
			end
		end


		def return_client_page_pagination(client)
			# Replace 5 with however many clients per page
			clientPages = (current_user.clients.count / Client::PER_PAGE.to_f).ceil
			client_page = 0

			for i in 1..clientPages
				current_user.clients.page(i).each do |client_test|
					if client == client_test
						client_page = i
					end
				end
			end

			client_page

		end

end