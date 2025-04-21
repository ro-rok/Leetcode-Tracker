# app/controllers/questions_controller.rb
class QuestionsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :random]

  # GET /companies/:company_id/questions
  def index
    company = Company.find(params[:company_id])
    qs = company.questions
                .where(timeframe: params[:timeframe])
                .select(:id, :title, :link, :difficulty, :frequency, :acceptance_rate, :topics)

    render json: qs.map { |q|
      {
        id:         q.id,
        title:      q.title,
        link:       q.link,
        difficulty: q.difficulty,
        frequency:  q.frequency,
        acceptance_rate: q.acceptance_rate,
        topics:     q.topics,
        solved:     current_user&.solved_questions&.exists?(q.id) || false
      }
    }
  end

  # GET /companies/:company_id/questions/random
  def random
    company = Company.find(params[:company_id])
    timeframe = params[:timeframe].presence || '30_days'
  
    scope = company.questions.where(timeframe: timeframe)
  
    if params[:difficulty].present?
      scope = scope.where(difficulty: params[:difficulty].upcase)
    end
  
    if params[:topics].present?
      scope = scope.where("topics LIKE ?", "%#{params[:topics]}%")
    end
  
    if user_signed_in?
      solved = current_user.user_questions.where(solved: true).pluck(:question_id)
      scope = scope.where.not(id: solved)
    end
  
    question = scope.order(Arel.sql("RANDOM()")).first
    return head :no_content unless question
  
    render json: question.slice(:id, :title, :link, :difficulty, :frequency, :topics)
  end
  

  # POST /questions/:id/solve
  def solve
    q  = Question.find(params[:id])
    uq = current_user.user_questions.find_or_initialize_by(question: q)
    uq.solved = true
    uq.save!
    render json: { solved: true, question_id: q.id }, status: :ok
  end

  # DELETE /questions/:id/solve
  def unsolve
    q  = Question.find(params[:id])
    uq = current_user.user_questions.find_by(question: q)
    return head(:not_found) unless uq

    uq.update!(solved: false)
    render json: { solved: false, question_id: q.id }, status: :ok
  end
end
