Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'sessions' }, defaults: { format: :json }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check 
  resources :companies, only: %i[index show] do
    resources :questions, only: [:index] do
      get :random, on: :collection
    end
    post :refresh, on: :member
  end

  resources :questions, only: [] do
    post   :solve,   on: :member
    delete :solve,   on: :member, action: :unsolve
  end
  # Defines the root path route ("/")
  # root "posts#index"
end
