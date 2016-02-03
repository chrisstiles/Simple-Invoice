class AddAttributesToLogos < ActiveRecord::Migration
  def change
    add_column :logos, :image, :string
    add_column :logos, :current_logo, :boolean, :default => true
  end
end
