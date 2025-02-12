class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.integer :base_invoice_number, default: 1
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
