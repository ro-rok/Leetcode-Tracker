class RefreshCsvJob < ApplicationJob
    def perform(company_id = nil)
      if company_id
        GithubCsvImporter.refresh_company!(Company.find(company_id))
      else
        GithubCsvImporter.refresh_all!
      end
    end
  end