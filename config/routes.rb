Rails.application.routes.draw do
  devise_for :users,
    skip: [:sessions],
    controllers: { registrations: 'registrations' },
    defaults: { format: :json }

devise_scope :user do
  post   '/users/sign_in',   to: 'sessions#create',  defaults: { format: :json }
  delete '/users/sign_out',  to: 'sessions#destroy', defaults: { format: :json }
  get    '/users/current',   to: 'sessions#current', defaults: { format: :json }
end

# Add explicit format to companies route
resources :companies, only: %i[index show], defaults: { format: :json } do
  # Keep existing nested routes
  resources :questions, only: [:index], defaults: { format: :json } do
    get :random, on: :collection, defaults: { format: :json }
  end
  post :refresh, on: :member, defaults: { format: :json }
  get :topics, on: :member, defaults: { format: :json }
end

  resources :questions, only: [] do
    post   :solve,   on: :member
    delete :solve,   on: :member, action: :unsolve
    post :chat, on: :member, to: 'chats#create', defaults: { format: :json }
    get  :chat, to: proc { [405, {}, ['Method Not Allowed']] }
  end
end