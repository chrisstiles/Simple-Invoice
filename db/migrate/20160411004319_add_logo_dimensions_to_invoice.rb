class AddLogoDimensionsToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :logo_width, :integer
    add_column :invoices, :logo_height, :integer
  end
end
