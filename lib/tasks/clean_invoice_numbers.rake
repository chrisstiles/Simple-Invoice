desc 'Changes estimate numbers to blanks strings for invoices and invoice numbers blank for estimates'
task clean_invoice_numbers: :environment do
	puts "Finding invoices with estimate numbers"
	invoices = Invoice.where("invoice_type = ? AND estimate_number != ?", "invoice", "")
	number = invoices.count
	invoices.update_all(estimate_number: "")
	puts "#{number} estimate numbers removed from invoices"
	
	puts "Finding estimates with invoice numbers"
	estimates = Invoice.where("invoice_type = ? AND invoice_number != ?", "estimate", "")
	number = estimates.count
	estimates.update_all(invoice_number: "")
	puts "#{number} invoice numbers removed from estimates"
end
