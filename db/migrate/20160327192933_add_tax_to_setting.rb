class AddTaxToSetting < ActiveRecord::Migration
  def change
    add_column :settings, :has_tax, :boolean, default: false
    add_column :settings, :tax, :decimal, default: 0
    add_column :settings, :tax_included, :boolean, default: false
  end
end
