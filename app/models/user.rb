class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :study_plans, dependent: :destroy
  has_many :user_activities, dependent: :destroy
  has_many :user_questions, dependent: :destroy
  has_many :solved_questions,
           -> { where(user_questions: { solved: true }) },
           through: :user_questions,
           source: :question
end
