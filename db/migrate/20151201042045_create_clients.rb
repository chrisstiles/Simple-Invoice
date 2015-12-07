class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :name
      t.string :email
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.string :phone
      t.boolean :is_primary
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
