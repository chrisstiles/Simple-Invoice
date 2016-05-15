desc 'Deletes invoices that are not saved to a specific user that are more than 30 days old. This should be run daily.'
task delete_old_invoices: :environment do
	puts "Finding invoices without a saved user older than 30 days"
	Invoice.where("user_id is null AND created_at < ?", Time.now - 31.days).destroy_all
	puts "Old invoices deleted!"
end
