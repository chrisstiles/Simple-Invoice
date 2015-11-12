class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.text :job_description
      t.decimal :job_quantity, :precision => 15, :scale => 4
      t.decimal :job_rate, :precision => 15, :scale => 4
      t.references :invoice, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
