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
				unless params.has_key?(:debug)
					wicked_pdf_image_tag image.logo.gsub('https', 'http'), width: @invoice.logo_width, height: @invoice.logo_height
				else
					image_tag image.logo, width: @invoice.logo_width, height: @invoice.logo_height
				end
			end
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


end
