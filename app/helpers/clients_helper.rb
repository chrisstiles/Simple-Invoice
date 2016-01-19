module ClientsHelper

	def client_id_or_zero(client)
		unless client.nil?
			client.id
		else
			0
		end
	end

end