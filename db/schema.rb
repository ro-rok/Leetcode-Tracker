# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_19_195736) do
  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "questions", force: :cascade do |t|
    t.string "title"
    t.string "link"
    t.string "difficulty"
    t.integer "frequency"
    t.float "acceptance_rate"
    t.string "timeframe"
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_questions_on_company_id"
  end

  create_table "study_plan_companies", force: :cascade do |t|
    t.integer "study_plan_id", null: false
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_study_plan_companies_on_company_id"
    t.index ["study_plan_id"], name: "index_study_plan_companies_on_study_plan_id"
  end

  create_table "study_plan_questions", force: :cascade do |t|
    t.integer "study_plan_id", null: false
    t.integer "question_id", null: false
    t.boolean "finished"
    t.json "tags"
    t.integer "revisits"
    t.datetime "last_attempted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_study_plan_questions_on_question_id"
    t.index ["study_plan_id"], name: "index_study_plan_questions_on_study_plan_id"
  end

  create_table "study_plans", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "name"
    t.string "timeframe"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_study_plans_on_user_id"
  end

  create_table "user_activities", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "action"
    t.json "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_activities_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "questions", "companies"
  add_foreign_key "study_plan_companies", "companies"
  add_foreign_key "study_plan_companies", "study_plans"
  add_foreign_key "study_plan_questions", "questions"
  add_foreign_key "study_plan_questions", "study_plans"
  add_foreign_key "study_plans", "users"
  add_foreign_key "user_activities", "users"
end
