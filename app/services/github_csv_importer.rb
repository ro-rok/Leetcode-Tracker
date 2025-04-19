# app/services/github_csv_importer.rb
require 'open-uri'
require 'csv'

class GithubCsvImporter
  RAW_BASE = "https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main"

  FILE_MAP = {
    '30_days'              => '1. Thirty Days.csv',
    '60_days'              => '2. Three Months.csv',
    '90_days'              => '3. Six Months.csv',
    'more_than_six_months' => '4. More Than Six Months.csv',
    'all_time'             => '5. All.csv'
  }

  def self.refresh_company!(company)
    puts "[Importer] 🚀 Starting import for #{company.name}"
    old_links = company.questions.pluck(:link)
    new_links = []

    FILE_MAP.each do |tf, fname|
      # escape for path segments (percent‑encode spaces, etc.)
      folder = URI::DEFAULT_PARSER.escape(company.name)
      file   = URI::DEFAULT_PARSER.escape(fname)
      url    = "#{RAW_BASE}/#{folder}/#{file}"
      puts "[Importer] 📥 Fetching #{tf} → #{url}"

      begin
        csv_text = URI.open(url).read
      rescue OpenURI::HTTPError
        puts "[Importer] ⚠️  #{fname} not found"
        next
      end

      CSV.parse(csv_text, headers: true).each do |row|
        title = row['Title']
        link  = row['Link']
        puts "[Importer]   ➡️  Row: #{title}"
        new_links << link

        q = Question.find_or_initialize_by(link: link, company: company, timeframe: tf)
        q.title           = title
        q.difficulty      = row['Difficulty']
        q.frequency       = row['Frequency'].to_i
        q.acceptance_rate = row['Acceptance Rate'].to_f
        q.save!
        puts "[Importer]      ✔️  Saved Q##{q.id}"
      end
    end

    (old_links - new_links).each do |link|
      puts "[Importer] 🗑️  Marking removed #{link}"
      if q = company.questions.find_by(link: link)
        q.metadata ||= {}
        q.metadata['removed_on'] = Date.today.to_s
        q.save!
      end
    end

    puts "[Importer] ✅ Done importing for #{company.name}"
  end
end
