class AddContactInfoToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :name, :string
    add_column :invoices, :address_line1, :string
    add_column :invoices, :address_line2, :string
    add_column :invoices, :phone, :string
  end
end
