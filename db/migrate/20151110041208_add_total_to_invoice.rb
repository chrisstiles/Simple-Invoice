class AddTotalToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :total, :string
  end
end
