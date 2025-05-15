# app/controllers/questions_controller.rb
class QuestionsController < ApplicationController
  skip_before_action :authenticate_user!, raise: false
  before_action :set_optional_user
  
  # GET /companies/:company_id/questions
  def index
    company = Company.find(params[:company_id])
    scope = company.questions.where(timeframe: params[:timeframe])
  
    # ✅ Add filters if present
    if params[:difficulty].present?
      scope = scope.where(difficulty: params[:difficulty].upcase)
    end

    if params[:topics].present?
      topics = params[:topics].split(',').map(&:strip)
      topics_query = topics.map { |t| "topics LIKE ?" }.join(' OR ')
      scope = scope.where(topics_query, *topics.map { |t| "%#{t}%" })
    end

    render json: scope.select(:id, :title, :link, :difficulty, :frequency, :acceptance_rate, :updated_at, :topics).order(:frequency, :updated_at).map { |q|
      {
        id: q.id,
        title: q.title,
        link: q.link,
        difficulty: q.difficulty,
        frequency: q.frequency,
        acceptance_rate: q.acceptance_rate,
        topics: q.topics,
        updated_at: q.updated_at,
        solved: @current_user&.solved_questions&.exists?(q.id) || false
      }
    }
  end

  # GET /companies/:company_id/questions/random
  def random
    company = Company.find(params[:company_id])
    timeframe = params[:timeframe].presence || '30_days'
    scope = company.questions.where(timeframe: timeframe)

    if params[:update].present?
      month_year = params[:update].split
      if month_year.length == 2
        month_name = month_year[0]
        year = "20" + month_year[1]
        
        month_number = Date::ABBR_MONTHNAMES.index(month_name.capitalize)
        
        if month_number && year.to_i.between?(2000, 2099)
          start_date = Date.new(year.to_i, month_number, 1)
          end_date = start_date.end_of_month
          
          scope = scope.where(updated_at: start_date.beginning_of_day..end_date.end_of_day)
        end
      end
    end

    if params[:difficulty].present?
      scope = scope.where(difficulty: params[:difficulty].upcase)
    end

    if params[:topics].present?
      scope = scope.where("topics LIKE ?", "%#{params[:topics]}%")
    end

    if @current_user
      solved_ids = @current_user.user_questions.where(solved: true).pluck(:question_id)
      scope = scope.where.not(id: solved_ids)
    end

    question = scope.order(Arel.sql("RANDOM()")).first
    return head :no_content unless question

    render json: question.slice(:id, :title, :link, :difficulty, :frequency, :topics)
  end

  # POST /questions/:id/solve
  def solve
    return render json: { error: "Invalid or missing user_id" }, status: :unauthorized unless @current_user
    q  = Question.find(params[:id])
    uq = @current_user.user_questions.find_or_initialize_by(question: q)
    uq.solved = true
    uq.solved_at = Time.current
    uq.save!
  
    render json: { solved: true, question_id: q.id }, status: :ok
  end

# DELETE /questions/:id/solve
  def unsolve
    return render json: { error: "Invalid or missing user_id" }, status: :unauthorized unless @current_user

    q  = Question.find(params[:id])
    uq = @current_user.user_questions.find_by(question: q)
    return head(:not_found) unless uq

    uq.update!(solved: false)
    render json: { solved: false, question_id: q.id }, status: :ok
  end
  
  def set_optional_user
    if params[:user_id].present?
      @current_user = User.find_by(id: params[:user_id])
    else
      Rails.logger.info "[WARN] No user_id provided in request"
      @current_user = nil
    end
  end
end
