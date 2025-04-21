# app/controllers/registrations_controller.rb
class RegistrationsController < Devise::RegistrationsController
    respond_to :json
    skip_before_action :verify_authenticity_token, raise: false
  
    private
  
    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: { id: resource.id, email: resource.email }
      else
        render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  