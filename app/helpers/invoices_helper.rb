module InvoicesHelper

	def print_days_until_due(invoice)
		if invoice.due_date.future?
			days = pluralize((invoice.due_date - Date.today).to_i, 'day')
			raw("Due in: <strong>#{days}</strong>")
		elsif invoice.due_date.today?
			raw("<strong class='overdue'>Due today</strong>")
		else invoice.due_date.past?
			days = pluralize((Date.today - invoice.due_date).to_i, 'day')
			raw("<span class='overdue'>Overdue by: <strong>#{days}</strong></span>")
		end 
	end

end
