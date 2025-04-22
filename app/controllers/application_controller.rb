class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, unless: -> { request.format.json? }

  # ✅ Override to fix Devise's `flash=` call issue
  def handle_unverified_request
    self.request.session_options[:skip] = true
    super
  rescue NoMethodError
    # ignore flash error in request object (API calls)
    render json: { error: "Invalid authenticity token" }, status: :unauthorized
  end

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[email password password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end
end
