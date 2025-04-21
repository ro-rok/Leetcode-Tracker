class SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_authenticity_token, raise: false

  # GET /users/current.json
  def current
    if current_user
      render json: { id: current_user.id, email: current_user.email }
    else
      head :unauthorized
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: { id: resource.id, email: resource.email }
  end

  def respond_to_on_destroy
    head :no_content
  end
end