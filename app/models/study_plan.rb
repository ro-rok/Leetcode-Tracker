class StudyPlan < ApplicationRecord
  belongs_to :user
  has_many :study_plan_companies, dependent: :destroy
  has_many :companies, through: :study_plan_companies
  has_many :study_plan_questions, dependent: :destroy
  has_many :questions, through: :study_plan_questions
end
