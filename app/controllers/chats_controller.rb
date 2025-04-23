class ChatsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  # before_action :authenticate_user!

  require 'open-uri'
  require 'json'
  require 'net/http'
  require 'nokogiri'
  require 'faraday'
  require 'http'
  require 'httpx/adapters/faraday'
  require 'faraday/retry'
  if Rails.env.development?
    require 'dotenv/load'
  end


  def create
     # Ensure the API key is set
    unless ENV['GROQ_API_KEY']
      Rails.logger.error "❌ Missing GROQ_API_KEY in environment variables"
      raise "GROQ_API_KEY is not set. Please set it in your environment variables."
    end
    Rails.logger.info "🔐 Current User: #{current_user&.email || '[None]'}"
    question = Question.find(params[:id])
    user_msg = params[:message].presence
    question_text = params[:question_text].presence || scrape_question_text(question.link)

    system_msg = "You are an expert LeetCode tutor and competitive programming coach. Be precise, logical, structured, and helpful — especially for debugging."

    user_msg_combined = <<~USER
      LeetCode Question Title:
      #{question.title}

      LeetCode Problem Description:
      #{question_text}

      Student Input:
      #{user_msg}

      Please:
      - Detect logical/syntax issues in code
      - Provide a correct code if needed
      - Explain the solution with time and space complexity
      - If a more optimal solution exists, provide that too
      - Walk through the solution step by step with an example
      - Explain time and space complexity
      - Include brief conceptual insights if useful
    USER
    Rails.logger.info "🔑 Using GROQ_API_KEY: #{ENV['GROQ_API_KEY'].present? ? '[SET]' : '[MISSING]'}"

    conn = Faraday.new(
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        "Authorization" => "Bearer #{ENV['GROQ_API_KEY']}",
        "Content-Type" => "application/json"
      },
      request: {
        timeout: 20,
        open_timeout: 10
      }
    ) do |f|
      f.request :retry, max: 2, interval: 0.5, backoff_factor: 2
      f.adapter :httpx
    end

    response = conn.post do |req|
      req.body = {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: system_msg },
          { role: "user", content: user_msg_combined }
        ],
        temperature: 0.5,
        max_tokens: 3072
      }.to_json
    end

    Rails.logger.info "🧠 Groq response: #{response.body}"

    if response.status != 200
      render json: { error: "AI service unavailable" }, status: :bad_gateway and return
    end

    json = JSON.parse(response.body)
    reply_text = json.dig("choices", 0, "message", "content") || "⚠️ No reply found"

    usage_headers = response.headers.slice(
      "x-ratelimit-limit-requests", "x-ratelimit-remaining-requests",
      "x-ratelimit-limit-tokens", "x-ratelimit-remaining-tokens"
    )

    render json: {
      reply: reply_text,
      usage: {
        request_limit: usage_headers["x-ratelimit-limit-requests"],
        requests_left: usage_headers["x-ratelimit-remaining-requests"],
        token_limit:   usage_headers["x-ratelimit-limit-tokens"],
        tokens_left:   usage_headers["x-ratelimit-remaining-tokens"]
      }
    }
  rescue OpenURI::HTTPError, Faraday::Error => e
    Rails.logger.error "❌ Groq API error: #{e.message}"
    render json: { error: "AI service unavailable: #{e.message}" }, status: :bad_gateway
  end

  private

  def scrape_question_text(url)
    slug = url.split("/").last
    url = "https://leetcode.com/graphql"
    query = <<~GRAPHQL
      query getQuestion($slug: String!) {
        question(titleSlug: $slug) {
          content
        }
      }
    GRAPHQL

    payload = {
      query: query,
      variables: { slug: slug }
    }

    resp = HTTP
      .headers(
        "Content-Type" => "application/json",
        "User-Agent"   => "Mozilla/5.0",
        "Accept"       => "application/json"
      )
      .post(url, body: payload.to_json)

    if resp.status.success?
      data = JSON.parse(resp.to_s)
      html = data.dig("data", "question", "content")
      return fallback_message unless html

      text = Nokogiri::HTML(html).text.strip
      return text[0..1_500]
    else
      fallback_message
    end
  rescue
    fallback_message
  end

  def fallback_message
    "Please paste the question text here."
  end
end
