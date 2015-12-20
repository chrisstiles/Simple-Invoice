class AddTotalToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :total, :decimal, :precision => 15, :scale => 4
  end
end
