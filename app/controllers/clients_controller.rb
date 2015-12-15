class ClientsController < ApplicationController
	before_action :set_client, only: [:show, :edit, :update, :destroy]
	after_action :set_non_primary_clients_to_false, only: [:create, :update]

	def index
		@clients = current_user.clients.order('LOWER(name) ASC')

		respond_to do |format|
			format.html
			format.json { render json: @clients }
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
				format.html { redirect_to clients_path, notice: 'Client was successfully created.' }
				format.json { render :show, status: :created, location: @client }
			else
				format.html { render :new }
				format.json { render json: @client.errors, status: :unprocessable_entity }
			end
		end
	end

	def edit
		
	end

	def update
		respond_to do |format|
			if @client.update(client_params)
				format.html { redirect_to clients_path, notice: 'Client was successfully created.' }
				format.json { render :show, status: :created, location: @client }
			else
				format.html { render :new }
				format.json { render json: @client.errors, status: :unprocessable_entity }
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
end