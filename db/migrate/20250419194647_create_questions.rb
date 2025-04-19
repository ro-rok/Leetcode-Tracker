class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.string :title
      t.string :link
      t.string :difficulty
      t.integer :frequency
      t.float :acceptance_rate
      t.string :timeframe
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
