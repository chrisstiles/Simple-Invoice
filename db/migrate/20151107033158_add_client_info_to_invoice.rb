class AddClientInfoToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :client_name, :string
    add_column :invoices, :client_address_line1, :string
    add_column :invoices, :client_address_line2, :string
  end
end
