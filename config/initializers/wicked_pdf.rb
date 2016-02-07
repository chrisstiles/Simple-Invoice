bin_location = case Rails.env
  when 'production' then "#{Rails.root}/bin/wkhtmltopdf-amd64"
  when 'development' then "/usr/local/bin/wkhtmltopdf"
  else `which wkhtmltopdf`
end

WickedPdf.config = { 
	:exe_path 		  => bin_location, 
	:page_size		  => 'Letter',
	:dpi              => '300',
	:margin           => { :top    => 13, # default 10 (mm)
	                  :bottom => 13,
	                  :left   => 0,
	                  :right  => 0 }
}