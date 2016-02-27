module ApplicationHelper

	def get_terms
		(@invoice.due_date - @invoice.date).to_i
	end

	def print_multiline(field)
	  field.gsub("\r\n","<br/>").html_safe
	end

	def print_number_or_na(number)
		is_number = Float(number) != nil rescue false

		if number
			number_to_currency(number, format: '%u %n')
		else
			""
		end

	end

	def print_subtotal(quantity, rate)
		valid_quantity = Float(quantity) != nil rescue false
		valid_rate = Float(rate) != nil rescue false

		if valid_quantity && valid_rate
			subtotal = quantity * rate
			number_to_currency(subtotal, format: '%u %n')
		else
			""
		end
	end
	

	def print_if_not_nil(data)
		if data.nil?
			''
		else
			data
		end
	end

	def print_full_address(city, state, zip)
		unless city.nil? || state.nil? || zip.nil?
			"#{city}, #{state} #{zip}"
		else
			''
		end
	end


end
