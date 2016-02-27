class AddLogoToInvoice < ActiveRecord::Migration
  def change
    add_column :invoices, :logo, :string, :default => ""
  end
end
