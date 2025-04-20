# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController
    respond_to :json
  
    # POST /users/sign_in.json
    def create
      self.resource = warden.authenticate!(auth_options)
      sign_in(resource_name, resource)
      render json: { id: resource.id, email: resource.email }, status: :ok
    end
  
    # DELETE /users/sign_out.json
    def destroy
      sign_out(resource_name)
      head :no_content
    end
  
    private
  
    def respond_to_on_destroy
      head :no_content
    end
  end
  