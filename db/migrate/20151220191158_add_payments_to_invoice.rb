class AddPaymentsToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :amount_paid, :decimal, :precision => 15, :scale => 4
    add_column :invoices, :balance, :decimal, :precision => 15, :scale => 4
  end
end
