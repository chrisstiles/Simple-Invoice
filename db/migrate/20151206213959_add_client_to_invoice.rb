class AddClientToInvoice < ActiveRecord::Migration
  def change
    add_reference :invoices, :client, index: true, foreign_key: true
  end
end
