class CreateInvoices < ActiveRecord::Migration
  def change
    create_table :invoices do |t|
      t.integer :invoice_number
      t.string :terms

      t.timestamps null: false
    end
  end
end
