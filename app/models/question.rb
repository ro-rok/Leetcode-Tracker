class Question < ApplicationRecord
  belongs_to :company
  has_many :study_plan_questions, dependent: :destroy
  has_many :study_plans, through: :study_plan_questions
end
