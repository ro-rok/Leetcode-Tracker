class ApplicationController < ActionController::Base
  # Only enforce CSRF on non‑JSON requests
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
end
