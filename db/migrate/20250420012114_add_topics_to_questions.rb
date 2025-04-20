class AddTopicsToQuestions < ActiveRecord::Migration[8.0]
  def change
    add_column :questions, :topics, :string
  end
end
