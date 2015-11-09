module ApplicationHelper

	def get_terms
		(@invoice.due_date - @invoice.date).to_i
	end

	def print_multiline(field)
	  field.gsub("\r\n","<br/>").html_safe
	end

	def print_subtotal(quantity, rate)
		valid_quantity = Float(quantity) != nil rescue false
		valid_rate = Float(rate) != nil rescue false

		if valid_quantity && valid_rate
			"$ #{quantity * rate}"
		else
			"N/A"
		end
	end

end
