Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               sessions:      'sessions',
               registrations: 'registrations'
             },
             defaults: { format: :json }

  devise_scope :user do
    get '/users/current', to: 'sessions#current', defaults: { format: :json }
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
  end
end