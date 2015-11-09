class AddWillDeleteToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :will_delete, :boolean, default: false
  end
end
