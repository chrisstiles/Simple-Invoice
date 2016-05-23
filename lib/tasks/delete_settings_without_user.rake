desc 'Deletes settings where the user_id is nil.'
task delete_settings_without_user: :environment do
	puts "Finding settings not assigned to a user"
	settings = Setting.where("user_id is null")
	number = settings.count
	settings.destroy_all
	puts "#{number} settings deleted!"
end
