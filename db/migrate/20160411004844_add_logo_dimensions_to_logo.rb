class AddLogoDimensionsToLogo < ActiveRecord::Migration
  def change
  	add_column :logos, :logo_width, :integer
   	add_column :logos, :logo_height, :integer
  end
end
