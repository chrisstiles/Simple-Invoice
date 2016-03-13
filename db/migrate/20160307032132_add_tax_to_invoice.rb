class AddTaxToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :has_tax, :boolean, default: false
    add_column :invoices, :tax, :decimal, default: 0
    add_column :invoices, :tax_included, :boolean, default: false
  end
end
