class RemoveLogoFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :logo, :string
  end
end
