class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:reset_progress]
  skip_before_action :authenticate_user!, raise: false
  before_action :set_optional_user

  # POST /users/reset_progress.json
  def reset_progress
    unless @current_user
      render json: { error: "Missing or invalid user_id" }, status: :unauthorized and return
    end

    if params[:company_id].present?
      @current_user.user_questions
                  .joins(:question)
                  .where(questions: { company_id: params[:company_id] })
                  .destroy_all
    else
      @current_user.user_questions.destroy_all
    end

    head :no_content
  end

  private

  def set_optional_user
    @current_user = User.find_by(id: params[:user_id])
  end
end
