json.array!(@invoices) do |invoice|
  json.extract! invoice, :id, :invoice_number, :terms
  json.url invoice_url(invoice, format: :json)
end
