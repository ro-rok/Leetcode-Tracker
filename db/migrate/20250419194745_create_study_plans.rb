class CreateStudyPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :study_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :timeframe

      t.timestamps
    end
  end
end
