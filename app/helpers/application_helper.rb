module ApplicationHelper

	def wicked_pdf_image_tag_for_public(img, options={})
		if img[0] == "/"
			new_image = img.slice(1..-1)
			image_tag "file://#{Rails.root.join('public', new_image)}", options
		else
			image_tag "file://#{Rails.root.join('public', 'images', img)}", options
		end
	end

	def asset_data_base64(path)
	  asset = Rails.application.assets.find_asset(path)
	  throw "Could not find asset '#{path}'" if asset.nil?
	  base64 = Base64.encode64(asset.to_s).gsub(/\s+/, "")
	  "data:#{asset.content_type};base64,#{Rack::Utils.escape(base64)}"
	end

	def pdf_image_tag(image)
		unless image.logo.blank?
			if Rails.env.production?
				image_tag image.logo.gsub('https', 'http'), width: @invoice.logo_width, height: @invoice.logo_height
			else
				image_tag image_url(image.logo.gsub('https', 'http')), width: @invoice.logo_width, height: @invoice.logo_height
			end
		end
	end

	def pdf_stylesheet_tag(stylesheet)
		raw("<link rel=\"stylesheet\" media=\"screen\" href=\"#{asset_path(stylesheet)}\" />")
	end

	def inline_stylesheet_contents(stylesheet)
		raw("<style>#{Rails.application.assets[stylesheet].to_s}</style>")
	end

	def read_asset(source)
      if Rails.configuration.assets.compile == false
        if asset_path(source) =~ URI_REGEXP
          require 'open-uri'
          open(asset_pathname(source), 'r:UTF-8') {|f| f.read }
        else
          IO.read(asset_pathname(source))
        end
      else
        Rails.application.assets.find_asset(source).to_s
      end
    end

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

	def page_title
		title = content_for :title
		if title.present?
			"#{title} | Simple Invoice"
		else
			"Simple Invoice"
		end 
	end

	def controller?(*controller)
		controller.include?(params[:controller])
	end

	def action?(*action)
		action.include?(params[:action])
	end

	def current_page(page, invoice_type = '')
		if controller?(page.to_s)
			unless invoice_type.empty?
				if request.path.include? invoice_type
					" current"
				else
					""
				end
			else
				" current"
			end
		else
			""
		end
	end

	def mobile_footer_class(isMobile)
		if isMobile
			raw("class='mobilefooter'")
		else
			raw("class='desktopfooter'")
		end
	end

end
