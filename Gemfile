source 'https://rubygems.org'
# Use specific Ruby Version
ruby "2.2.4"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.5.1'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Generate PDFs
gem 'wicked_pdf', '0.9.9'
gem 'wkhtmltopdf-binary'

# Autoprefix CSS
gem "autoprefixer-rails"

# Hirb for database viewing in console
gem "hirb"

# Pagination
gem 'will_paginate', '~> 3.0.6'

# Validations for non ActiveRecord models
gem 'active_attr'

# Allow completely custom error messages
gem 'custom_error_message'

# Set user's timezone
gem 'browser-timezone-rails'

# Admin panel
gem 'rails_admin'

# Authorization
gem 'cancancan', '~> 1.10'

# Fastclick for mobile browsers
gem 'fastclick-rails'

# Detect user's browser
gem 'browser'


# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Upload images
gem 'carrierwave',             '0.10.0'
gem 'mini_magick',             '3.8.0'
gem 'fog',                     '1.36.0'

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Devise for user login

gem 'devise'

# Replace empty strings with nil
gem "nilify_blanks"

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'sass-rails'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
  gem 'bullet'

  # Use sqlite3 as the database for Active Record in development
  gem 'sqlite3'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Mail in development
  gem "letter_opener"

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

end

group :production do
  gem 'pg',             '0.17.1'
  gem 'rails_12factor', '0.0.2'
  gem 'heroku-deflater'
  gem 'puma'
  gem 'wkhtmltopdf-heroku'
end

