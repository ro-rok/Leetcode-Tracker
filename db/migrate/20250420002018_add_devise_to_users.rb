# frozen_string_literal: true
class AddDeviseToUsers < ActiveRecord::Migration[8.0]
  def change
    change_table :users, bulk: true do |t|
      unless column_exists?(:users, :email)
        t.string :email,              null: false, default: ""
      end

      unless column_exists?(:users, :encrypted_password)
        t.string :encrypted_password, null: false, default: ""
      end

      ## Recoverable
      unless column_exists?(:users, :reset_password_token)
        t.string   :reset_password_token
      end
      unless column_exists?(:users, :reset_password_sent_at)
        t.datetime :reset_password_sent_at
      end

      ## Rememberable
      unless column_exists?(:users, :remember_created_at)
        t.datetime :remember_created_at
      end

      # (you can leave :trackable, :confirmable, etc. out for now)
    end

    # Index additions
    unless index_exists?(:users, :email, unique: true)
      add_index :users, :email,                unique: true
    end
    unless index_exists?(:users, :reset_password_token, unique: true)
      add_index :users, :reset_password_token, unique: true
    end
  end
end
