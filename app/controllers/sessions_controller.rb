class SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_authenticity_token, raise: false

  def current
    # Add this line to explicitly set the mapping
    request.env["devise.mapping"] = Devise.mappings[:user]
    
    # Check if we have a user from warden
    if warden.authenticated?(:user)
      render json: { id: current_user.id, email: current_user.email }
    else
      head :unauthorized
    end
  end
  
  def create
    begin
      user_email = params.dig(:user, :email) || params.dig(:session, :user, :email)
      user_password = params.dig(:user, :password) || params.dig(:session, :user, :password)
      
      user = User.find_by(email: user_email)
      
      if user.nil?
        Rails.logger.error("User not found: #{user_email}")
        render json: { error: "Invalid credentials" }, status: :unauthorized
        return
      end
      
      # Use standard devise auth flow rather than manual
      if user.valid_password?(user_password)
        sign_in(:user, user)
        
        # Set additional cookie for better compatibility
        cookies.signed[:user_id] = {
          value: user.id,
          httponly: true,
          secure: Rails.env.production?,
          # Setting same_site to none to allow cross-site requests
          same_site: :none
        }
        
        render json: { id: user.id, email: user.email }
      else
        render json: { error: "Invalid credentials" }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error("Authentication error: #{e.message}")
      render json: { error: "Authentication error" }, status: :unauthorized
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