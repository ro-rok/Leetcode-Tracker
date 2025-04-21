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

  post 'users/reset_progress', to: 'users#reset_progress', defaults: { format: :json }

  resources :companies, only: %i[index show] do
    resources :questions, only: [:index] do
      get :random, on: :collection
    end
    post :refresh, on: :member
  end

  resources :questions, only: [] do
    post   :solve,   on: :member
    delete :solve,   on: :member, action: :unsolve
    post   :chat,    on: :member, controller: 'chats'
  end
end