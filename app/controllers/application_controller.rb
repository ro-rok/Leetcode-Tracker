class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # Devise strong params for sign_up & sign_in
  def configure_permitted_parameters
    # For sign up
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[email password password_confirmation])
    # For sign in
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end
end
