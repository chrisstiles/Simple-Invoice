module InvoicesHelper

  def has_any_invoices?
    if current_user.invoices.where(archived: false).any?
      true
    else
      false
    end
  end

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

      total_due
      
    end

    def return_client_email_or_blank(invoice)
    	if invoice.client && invoice.client.email
    		invoice.client.email
    	else
    		""
    	end
    end

    def email_subject(invoice)
      if current_user.name.present?
        "#{invoice.display_invoice_type} ##{invoice.display_number} from #{current_user.proper_name}"
      else
        "#{invoice.display_invoice_type} ##{invoice.display_number}"
      end
    end

    def display_public_invoice_url(invoice)
    	unless invoice.token.blank? || invoice.token.nil?
    		public_invoice_url(invoice.token)
    	else
    		'No public URL'
    	end
    end

    def display_content_editable
      if user_signed_in?
        if controller_name == "invoices" && (action_name == "new" || action_name == "edit")
          raw(" contenteditable='true'")
        else
          ''
        end
      else
        if controller_name == "static_pages" && action_name == "home"
          raw(" contenteditable='true'")
        else
          ''
        end
      end
    end


    def link_to_for(text, action, invoice, method = "get")
      invoice_type = invoice.display_invoice_type.downcase

      link = "#{action}_#{invoice_type}_path"

      link_to text.to_s, self.send(link, invoice.display_number), method: method.to_sym
    end


    def invoice_link(invoice, action = "", format = "")
      unless action.blank?
        action.concat("_")
      end

      if invoice.is_estimate?
        Rails.application.routes.url_helpers.send("#{action}estimate_path", invoice.estimate_number, format: format)
      else
        Rails.application.routes.url_helpers.send("#{action}invoice_path", invoice.invoice_number, format: format)
      end
    end

    def invoice_type_class(invoice)
      if invoice.present? && invoice.is_estimate?
        "isestimate"
      else
        "isinvoice"
      end
    end

    def url_is_estimate?
      request.original_url.include? "estimates"
    end

    def invoice_type_by_url
      if url_is_estimate?
        "Estimate"
      else
        "Invoice"
      end
    end

    def new_invoice_button(classes)
      # if classes.include? "mobilelink"
        
      # else

      # end
      if url_is_estimate?
        link_to "New Estimate", new_estimate_path, class: classes
      else
        link_to "New Invoice", new_invoice_path, class: classes
      end
    end

    def default_message(invoice)
      client = invoice.client_name || "Valued Client"

      if current_user.name.present?
        salutation = ",\n#{current_user.proper_name}"
      else
        salutation = ""
      end

      greeting = "Dear #{client},\n"

      if invoice.is_estimate?
        "#{greeting}"\
        "Thank you for your interest in working with me. You may find your #{invoice.invoice_type} attached.\n\n"\
        "Regards#{salutation}"
      else
        thank_you = "Thank you for your business. You may find your #{invoice.invoice_type} attached."
        if invoice.overdue?
          if invoice.due_today?
            "#{greeting}"\
            "#{thank_you} Please pay at your earliest convenience. This is a friendly reminder that "\
            "the balance of #{number_to_currency(invoice.balance)} is due today, #{invoice.due_date.strftime("%B %d, %Y")}\n\n"\
            "Regards#{salutation}"
          else
            "#{greeting}"\
            "#{thank_you} Please pay at your earliest convenience. This is a friendly reminder that "\
            "the balance of #{number_to_currency(invoice.balance)} was due by #{invoice.due_date.strftime("%B %d, %Y")}\n\n"\
            "Regards#{salutation}"
          end
        else
          "#{greeting}"\
          "#{thank_you}"\
          " Please pay the balance of #{number_to_currency(invoice.balance)} by #{invoice.due_date.strftime("%B %d, %Y")}\n\n"\
          "Regards#{salutation}"
        end
      end

     
    end

    def mobile_create_button
      if url_is_estimate?
        link_to "", new_estimate_path, class: "mobilecreatebutton"
      else
        link_to "", new_invoice_path, class: "mobilecreatebutton"
      end
    end

    def mobile_home_create_button
      if url_is_estimate?
        link_to "New Estimate", new_estimate_path, class: "mobilehomecreatebutton button blue newinvoiceicon"
      else
        link_to "New Invoice", new_invoice_path, class: "mobilehomecreatebutton button blue newinvoiceicon"
      end
    end

end
