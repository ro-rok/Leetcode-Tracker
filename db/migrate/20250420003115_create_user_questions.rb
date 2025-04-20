class CreateUserQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :user_questions do |t|
      t.references :user,     null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.boolean    :solved,   null: false, default: true
      t.datetime   :solved_at

      t.timestamps
    end

    add_index :user_questions, %i[user_id question_id], unique: true
  end
end
