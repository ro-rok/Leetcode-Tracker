class Question < ApplicationRecord
  belongs_to :company
  has_many :study_plan_questions, dependent: :destroy
  has_many :study_plans, through: :study_plan_questions
  has_many :user_questions, dependent: :destroy
  has_many :solvers,
           through: :user_questions,
           source: :user
end
