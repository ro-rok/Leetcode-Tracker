class Company < ApplicationRecord
    has_many :questions, dependent: :destroy
    has_many :study_plan_companies, dependent: :destroy
    has_many :study_plans, through: :study_plan_companies
  end
  