class CreateStudyPlanCompanies < ActiveRecord::Migration[8.0]
  def change
    create_table :study_plan_companies do |t|
      t.references :study_plan, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
