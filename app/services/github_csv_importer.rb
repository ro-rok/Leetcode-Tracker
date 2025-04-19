require 'net/http'
require 'uri'
require 'csv'

class GithubCsvImporter
  RAW_BASE   = "https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main"
  TIMEFRAMES = %w[30_days 60_days 90_days all_time]

  def self.refresh!
    Company.find_each do |company|
      TIMEFRAMES.each do |tf|
        url = "#{RAW_BASE}/#{company.name}/#{tf}.csv"
        uri = URI(url)
        res = Net::HTTP.get_response(uri)
        next unless res.is_a?(Net::HTTPSuccess)

        CSV.parse(res.body, headers: true).each do |row|
          q = Question.find_or_initialize_by(link: row['Link'])
          q.title           = row['Title']
          q.difficulty      = row['Difficulty']
          q.frequency       = row['Frequency'].to_i
          q.acceptance_rate = row['Acceptance Rate'].to_f
          q.company         = company
          q.timeframe       = tf
          q.save!
        end
      end
    end
  end
end