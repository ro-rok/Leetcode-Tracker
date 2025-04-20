class QuestionsController < ApplicationController
    before_action :authenticate_user!, except: [:index]
    def index
      company = Company.find(params[:company_id])
      qs = company.questions
                  .where(timeframe: params[:timeframe])
                  .select(:id, :title, :link, :difficulty, :frequency)
  
      render json: qs.map { |q|
        {
          id:         q.id,
          title:      q.title,
          link:       q.link,
          difficulty: q.difficulty,
          frequency:  q.frequency,
          solved:     current_user&.solved_questions&.exists?(q.id) || false
        }
      }
    end
  
    # POST   /questions/:id/solve
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
  