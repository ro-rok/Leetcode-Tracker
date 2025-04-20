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

    scope = company.questions
                   .where(timeframe: params[:timeframe])
                   .where(difficulty: params[:difficulty].upcase)
    if params[:topics].present?
     # treat NULL as empty string so LIKE won’t blow up on nil
     scope = scope.where("COALESCE(topics, '') LIKE ?", "%#{params[:topics]}%")
    end

    if user_signed_in?
      solved_ids = current_user.user_questions.where(solved: true).pluck(:question_id)
      scope = scope.where.not(id: solved_ids)
    end

    question = scope.order(Arel.sql("RANDOM()")).first
    return head :no_content unless question

    render json: {
      id:         question.id,
      title:      question.title,
      link:       question.link,
      difficulty: question.difficulty,
      frequency:  question.frequency,
      acceptance_rate: question.acceptance_rate,
      topics:     question.topics
    }
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
