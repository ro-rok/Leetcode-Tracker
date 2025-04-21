class Rack::Attack
    # throttle POST /questions/:id/chat to 5 requests per minute per user/IP
    throttle('ai_chat/user', limit: 5, period: 1.minute) do |req|
      if req.path.match?(/^\/questions\/\d+\/chat/) && req.post?
        req.env['warden'].user&.id || req.ip
      end
    end
  
    self.throttled_response = lambda do |env|
      [ 429, { 'Content-Type' => 'application/json' },
        [{ error: "Rate limit exceeded. Try again later." }.to_json] ]
    end
  end
  
  Rails.application.config.middleware.use Rack::Attack
  