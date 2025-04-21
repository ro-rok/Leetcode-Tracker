# app/controllers/users_controller.rb
class UsersController < ApplicationController
    before_action :authenticate_user!
  
    # POST /users/reset_progress.json
    # If you pass `company_id` in the body, only that company's progress is reset.
    def reset_progress
      if params[:company_id].present?
        # only delete solves for questions belonging to that company
        current_user.user_questions
                    .joins(:question)
                    .where(questions: { company_id: params[:company_id] })
                    .destroy_all
      else
        # delete all solves
        current_user.user_questions.destroy_all
      end
  
      head :no_content
    end
  end
  