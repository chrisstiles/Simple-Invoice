class AddUserSettingsToUser < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    add_column :users, :address_line1, :string
    add_column :users, :address_line2, :string
    add_column :users, :phone, :string
  end
end
