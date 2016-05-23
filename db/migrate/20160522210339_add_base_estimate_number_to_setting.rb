class AddBaseEstimateNumberToSetting < ActiveRecord::Migration
  def change
    add_column :settings, :base_estimate_number, :integer, default: 1
  end
end
