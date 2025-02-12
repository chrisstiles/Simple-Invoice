class CreateUserEmails < ActiveRecord::Migration[5.0]
  def change
    create_table :user_emails do |t|
      t.string :recipients
      t.string :message
      t.references :invoice, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
