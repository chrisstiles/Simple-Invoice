class AddTypeToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :invoice_type, :string, default: "invoice"
    add_column :invoices, :estimate_number, :integer, default: 1, index: true, foreign_key: true
  end
end
