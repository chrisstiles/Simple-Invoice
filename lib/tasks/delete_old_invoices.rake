desc 'Deletes invoices that are not saved to a specific user that are more than 30 days old. This should be run daily.'
task delete_old_invoices: :environment do
	puts "Finding invoices without a saved user older than 30 days"
	invoices = Invoice.where("user_id is null AND created_at < ?", Time.now - 31.days)
	number = invoices.count
	invoices.destroy_all
	puts "#{number} old invoices deleted!"
end
