Rails.application.config.session_store :cookie_store,
  key: '_leetcode_tracker_session',
  same_site: :none,
  http_only: true,
  domain: nil, 
  secure: Rails.env.production?