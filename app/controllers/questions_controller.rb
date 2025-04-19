class QuestionsController < ApplicationController
    # GET /companies/:company_id/questions?timeframe=30_days
    skip_before_action :authenticate_user!, only: [:index]

    def index
      company   = Company.find(params[:company_id])
      timeframe = params[:timeframe] || "all_time"
      qs        = company.questions.where(timeframe: timeframe)
  
      render json: qs.select(:id, :title, :link, :difficulty, :frequency)
    end
  end
  