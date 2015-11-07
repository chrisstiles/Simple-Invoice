class AddArchivedToInvoices < ActiveRecord::Migration
  def change
    add_column :invoices, :archived, :boolean, :default => false
  end
end
