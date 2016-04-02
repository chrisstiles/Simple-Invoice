class AddTokenToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :token, :string, unique: true, index: true
  end
end
