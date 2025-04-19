namespace :refresh do
    desc "Refresh LeetCode questions from GitHub CSVs"
    task questions: :environment do
      GithubCsvImporter.refresh_all!
      puts "Imported all questions at #{Time.current}"
    end
  end