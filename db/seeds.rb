require 'net/http'
require 'json'
require 'uri'

puts "Fetching company list from GitHub…"
uri   = URI("https://api.github.com/repos/liquidslr/leetcode-company-wise-problems/contents")
res   = Net::HTTP.get_response(uri)
items = JSON.parse(res.body)

dirs = items.select { |item| item["type"] == "dir" }.map { |item| item["name"] }

dirs.each do |company_name|
  Company.find_or_create_by!(name: company_name)
end

puts "Seeded #{Company.count} companies."