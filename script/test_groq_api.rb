require 'json'
require 'faraday'
require 'dotenv/load'
require 'httpx'
require 'httpx/adapters/faraday'
require "faraday/retry" 

GROQ_API_KEY = ENV['GROQ_API_KEY']
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "mixtral-8x7b-32768"

question = "3Sum"
question_text = "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0."
user_msg = <<~CODE
  class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        ans = []
        n = len(nums)
        for i in range(n - 2):
            if idx - 1 >= 0 and nums[idx] == nums[idx - 1]:
                continue
            left, right = idx + 1, n - 1
            while left < right:
                total = nums[idx] + nums[left] + nums[right]
                if total > 0:
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    ans.append([nums[idx], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
        return ans
CODE

# Construct full prompt as system + user message
system_msg = <<~SYSTEM
  You are an expert LeetCode tutor and competitive programming coach.
  Be precise, logical, structured, and helpful — especially for debugging.
SYSTEM

user_msg_combined = <<~USER
LeetCode Question Title:
#{question}

LeetCode Problem Description:
#{question_text}

Student Input:
#{user_msg}

Please:
- Detect logical/syntax issues in code
- Provide a correct code if needed
- Explain the solution with time and space complexity
- If a more optimal solution exists, provide that too
- Walk through the solution step by step
- Explain time and space complexity
- Include brief conceptual insights if useful
USER

# Setup connection
Faraday.default_adapter = :httpx

Faraday.default_adapter = :httpx

conn = Faraday.new(
  url: GROQ_API_URL,
  headers: {
    "Authorization" => "Bearer #{GROQ_API_KEY}",
    "Content-Type" => "application/json"
  },
  request: {
    timeout: 20,
    open_timeout: 10
  }
) do |f|
  f.request :retry, max: 2, interval: 0.5, backoff_factor: 2
  f.adapter :httpx
end


# Make POST request
response = conn.post do |req|
  req.body = {
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: system_msg },
      { role: "user", content: user_msg_combined },
    ],
    temperature: 0.5,
    max_tokens: 1024
  }.to_json
end

# Output
puts "Status: #{response.status}"
if response.status == 200
  json = JSON.parse(response.body)
  puts "\n--- AI Response ---"
  puts json["choices"]&.first&.dig("message", "content")
else
  puts "Error:"
  puts response.body
end