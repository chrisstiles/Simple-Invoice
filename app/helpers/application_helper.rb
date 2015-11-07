module ApplicationHelper
	def get_terms
		(@invoice.due_date - @invoice.date).to_i
	end
end
