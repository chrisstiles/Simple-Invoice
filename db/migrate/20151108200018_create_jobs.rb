class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.text :job_description
      t.integer :job_quantity
      t.integer :job_rate
      t.references :invoice, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
