# db/seeds.rb
require 'net/http'
require 'json'
require 'uri'

# If FAANG_ONLY is set, seed only FAANG companies for quick bootstrap
if ENV['FAANG_ONLY'] == 'true'
  puts "Seeding FAANG companies only..."
  %w[Google Amazon Apple Netflix Meta].each do |name|
    Company.find_or_create_by!(name: name)
  end
else
  puts "Fetching full company list from GitHub…"
  uri   = URI("https://api.github.com/repos/liquidslr/leetcode-company-wise-problems/contents")
  res   = Net::HTTP.get_response(uri)
  items = JSON.parse(res.body)

  dirs = items.select { |item| item["type"] == "dir" }.map { |item| item["name"] }

  dirs.each do |company_name|
    Company.find_or_create_by!(name: company_name)
  end
end

puts "Seeded #{Company.count} companies."
