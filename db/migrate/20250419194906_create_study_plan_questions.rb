class CreateStudyPlanQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :study_plan_questions do |t|
      t.references :study_plan, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.boolean :finished
      t.json :tags
      t.integer :revisits
      t.datetime :last_attempted_at

      t.timestamps
    end
  end
end
