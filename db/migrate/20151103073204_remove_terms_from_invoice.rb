class RemoveTermsFromInvoice < ActiveRecord::Migration
  def up
  	remove_column :invoices, :terms
  end
end
