require 'faraday'
require 'json'

class Ai21Client
  BASE_URL = 'https://api.ai21.com/studio/v1/j2-grande-instruct/complete'

  def initialize(api_key = ENV['AI21_API_KEY'])
    @api_key = api_key
    @conn    = Faraday.new(url: BASE_URL) do |f|
      f.request  :json
      f.response :raise_error
      f.adapter  Faraday.default_adapter
    end
  end

  def complete(prompt, max_tokens: 500)
    resp = @conn.post do |req|
      req.headers['Authorization'] = "Bearer #{@api_key}"
      req.body = {
        prompt: prompt,
        numResults: 1,
        maxTokens: max_tokens,
        stopSequences: [],
        temperature: 0.7
      }
    end
    JSON.parse(resp.body)
        .dig('completions', 0, 'data', 'text')
        &.strip
  end
end
