class CreateUserActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :user_activities do |t|
      t.references :user, null: false, foreign_key: true
      t.string :action
      t.json :metadata

      t.timestamps
    end
  end
end
