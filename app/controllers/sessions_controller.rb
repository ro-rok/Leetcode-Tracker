# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController
    # Skip Rails’ CSRF check for JSON requests so Devise doesn’t blow up trying to set flash on the request
    skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  
    respond_to :json
  
    # POST /users/sign_in.json
    def create
      super do |user|
        # return just the JSON we want
        return render json: { id: user.id, email: user.email }
      end
    end
  
    # DELETE /users/sign_out.json
    def destroy
      super { head :no_content }
    end
  end
  