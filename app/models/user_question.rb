class UserQuestion < ApplicationRecord
  belongs_to :user
  belongs_to :question

  # when marking solved, record timestamp
  before_save do
    self.solved_at = Time.current if solved_changed? && solved
  end
end
