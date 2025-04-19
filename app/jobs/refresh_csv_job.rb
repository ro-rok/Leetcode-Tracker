class RefreshCsvJob < ApplicationJob
    queue_as :default
  
    def perform
      GithubCsvImporter.refresh!
    end
  end