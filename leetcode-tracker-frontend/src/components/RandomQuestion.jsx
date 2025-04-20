import { useState } from 'react'

export default function RandomQuestion({ companyId, timeframe, difficulty, topics, session }) {
  const [q, setQ] = useState(null)

  const fetchRandom = () => {
    let url = `/companies/${companyId}/questions/random.json?timeframe=${timeframe}&difficulty=${difficulty}`
    if (topics) url += `&topics=${encodeURIComponent(topics)}`
    fetch(url, { credentials: 'include' })
      .then(r => {
        if (r.status === 204) return null
        return r.json()
      })
      .then(setQ)
  }

  return (
    <div className="mt-6">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={fetchRandom}
      >
        Get Random Question
      </button>

      {q && (
        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h3 className="font-medium">{q.title}</h3>
          <div className="text-sm text-gray-700">
            {q.difficulty} · freq: {q.frequency}
          </div>
          <a href={q.link} target="_blank" className="text-blue-600 underline">
            View on LeetCode
          </a>
        </div>
      )}
    </div>
  )
}
