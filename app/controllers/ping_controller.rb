# app/controllers/ping_controller.rb
class PingController < ActionController::API
  def show
    head :ok
  end
end
