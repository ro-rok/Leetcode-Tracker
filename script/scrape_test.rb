#!/usr/bin/env ruby
require 'http'
require 'json'
require 'nokogiri'

FALLBACK = "Please paste the question text here."

def fallback; FALLBACK; end

def fetch_description(slug)
  url = "https://leetcode.com/graphql"
  query = <<~GRAPHQL
    query getQuestion($slug: String!) {
      question(titleSlug: $slug) {
        content
      }
    }
  GRAPHQL

  payload = {
    query: query,
    variables: { slug: slug }
  }

  resp = HTTP
    .headers(
      "Content-Type"  => "application/json",
      "User-Agent"    => "Mozilla/5.0",
      "Accept"        => "application/json"
    )
    .post(url, body: payload.to_json)

  if resp.status.success?
    data = JSON.parse(resp.to_s)
    html = data.dig("data","question","content")
    return fallback unless html

    # strip HTML tags, truncate:
    text = Nokogiri::HTML(html).text.strip
    return text[0..1_500]
  else
    fallback
  end
rescue
  fallback
end

if __FILE__ == $0
  slug = "two-sum"
  puts "Fetching description for #{slug}…"
  puts "—" * 60
  puts fetch_description(slug)
  puts "—" * 60
end
