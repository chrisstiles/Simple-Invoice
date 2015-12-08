bin_location = case Rails.env
  when 'production' then "#{Rails.root}/bin/wkhtmltopdf-i386"
  when 'development' then "/usr/local/bin/wkhtmltopdf"
  else `which wkhtmltopdf`
end

WickedPdf.config = { :exe_path => bin_location }