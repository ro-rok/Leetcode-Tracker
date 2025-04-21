class ChatsController < ApplicationController
    before_action :authenticate_user!
    require 'http'         # for our GraphQL fetch
    require 'nokogiri'
  
    def create
      question = Question.find(params[:question_id])
  
      # if the user supplied a chat message, use it; otherwise pull down the problem text
      user_msg = params[:message].presence || fetch_question_text(question.link)
  
      prompt = <<~PROMPT
        You are an expert at explaining LeetCode problems.
  
        Question: #{question.title}
        Link: #{question.link}
  
        Student input:
        #{user_msg}
  
        1) Identify any errors in the student’s code/logic.
        2) Provide a correct solution with Ruby code and explain its time & space complexity.
        3) If there’s a more optimal solution, provide that code & its complexities.
        4) Walk through the solution step by step.
      PROMPT
  
      ai_reply = Ai21Client.new.complete(prompt)
      render json: { reply: ai_reply }
    rescue HTTP::Error, Faraday::Error => e
      render json: { error: "AI service unavailable: #{e.message}" }, status: :bad_gateway
    end
  
    private
  
    # Pulls the problem description via LeetCode's own GraphQL API
    def fetch_question_text(url)
      slug = url.split("/").last
      graphql = <<~GQL
        query getQuestion($slug: String!) {
          question(titleSlug: $slug) { content }
        }
      GQL
  
      resp = HTTP.headers(
        "Content-Type" => "application/json",
        "User-Agent"   => "Mozilla/5.0",
        "Accept"       => "application/json"
      ).post(
        "https://leetcode.com/graphql",
        json: { query: graphql, variables: { slug: slug } }
      )
  
      unless resp.status.success?
        return fallback_message
      end
  
      html = resp.parse.dig("data", "question", "content")
      return fallback_message if html.blank?
  
      # strip tags, join text, truncate
      text = Nokogiri::HTML(html).text.strip
      text[0..1_500]
    rescue
      fallback_message
    end
  
    def fallback_message
      "Please paste the question text here."
    end
  end
  