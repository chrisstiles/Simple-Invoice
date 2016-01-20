module ClientsHelper

	def client_id_or_zero(client)
		unless client.nil?
			client.id
		else
			0
		end
	end

	def show_edit_or_new_client(client)
		if client.name.nil?
			'New Client'
		else
			"Edit <span class='clientnameheading'>#{client.name}</span>".html_safe
		end
	end

end