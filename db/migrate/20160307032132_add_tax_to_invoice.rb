class AddTaxToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :has_tax, :boolean
    add_column :invoices, :tax, :decimal, default: 0
    add_column :invoices, :tax_included, :boolean
  end
end
