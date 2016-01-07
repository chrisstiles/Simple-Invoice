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

	def number_of_due_invoices
		current_user.invoices.where('archived = ? AND due_date <= ? AND balance > ?', false, Date.today, 0).count
	end

	def total_amount_due
      total_due = 0

      current_user.invoices.where(archived: false).each do |invoice|
        unless invoice.due_date.future?
          total_due += invoice.balance
        end
      end

      total_due
      
    end

end
