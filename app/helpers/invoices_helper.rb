module InvoicesHelper

	def print_days_until_due(invoice)
		if invoice.total - invoice.amount_paid > 0
			if invoice.due_date > Date.today
				days = pluralize((invoice.due_date - Date.today).to_i, 'day')
				raw("Due in: <strong>#{days}</strong>")
			elsif invoice.due_date == Date.today
				raw("<strong class='overdue'>Due today</strong>")
			else invoice.due_date < Date.today
				days = pluralize((Date.today - invoice.due_date).to_i, 'day')
				raw("<span class='overdue'>Overdue by: <strong>#{days}</strong></span>")
			end
		else
			raw("<span class='paidinfull'>Paid in full</span>")
		end
	end

	def number_of_due_invoices
		current_user.invoices.where('archived = ? AND due_date <= ? AND total - amount_paid > ?', false, Date.today, 0).count
	end

	def total_amount_due
      total_due = 0

      invoices = current_user.invoices.where(archived: false)

      invoices.each do |invoice|
        unless invoice.due_date.future?
          total_due += (invoice.total - invoice.amount_paid)
        end
      end

      print "TOTAL DUE: #{total_due} :: Count: #{invoices.count}"
      total_due
      
    end

    def return_client_email_or_blank(invoice)
    	if invoice.client && invoice.client.email
    		invoice.client.email
    	else
    		""
    	end
    end

    def display_public_invoice_url(invoice)
    	unless invoice.token.blank? || invoice.token.nil?
    		public_invoice_url(invoice.token)
    	else
    		'No public URL'
    	end
    end

end
