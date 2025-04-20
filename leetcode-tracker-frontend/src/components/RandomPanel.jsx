// src/components/RandomPanel.jsx
import React, { useState } from 'react'
import api from '../api'

export default function RandomPanel({ company }) {
  const [tf, setTf] = useState('30_days')
  const [diff, setDiff] = useState('EASY')
  const [topics, setTopics] = useState('')
  const [question, setQuestion] = useState(null)

  const handleRandom = async e => {
    e.preventDefault()
    const params = { timeframe: tf, difficulty: diff }
    if (topics) params.topics = topics
    const res = await api.get(
      `/companies/${company.id}/questions/random.json`,
      { params }
    )
    setQuestion(res.status === 204 ? null : res.data)
  }

  return (
    <div>
      <h2 className="text-lg mb-2">Random Question</h2>
      <form onSubmit={handleRandom} className="flex space-x-2 mb-4">
        <select
          value={tf}
          onChange={e => setTf(e.target.value)}
          className="p-2 rounded bg-white dark:bg-gray-700"
        >
          <option value="30_days">30d</option>
          <option value="60_days">60d</option>
          <option value="90_days">90d</option>
          <option value="more_than_six_months">&gt;6m</option>
          <option value="all_time">all</option>
        </select>
        <select
          value={diff}
          onChange={e => setDiff(e.target.value)}
          className="p-2 rounded bg-white dark:bg-gray-700"
        >
          <option>EASY</option>
          <option>MEDIUM</option>
          <option>HARD</option>
        </select>
        <input
          type="text"
          placeholder="topics"
          value={topics}
          onChange={e => setTopics(e.target.value)}
          className="p-2 rounded flex-1 bg-white dark:bg-gray-700"
        />
        <button className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded">
          Go
        </button>
      </form>
      {question ? (
        <div>
          <a
            href={question.link}
            target="_blank"
            rel="noopener"
            className="underline"
          >
            {question.title}
          </a>{' '}
          · {question.difficulty} · freq: {question.frequency}
        </div>
      ) : (
        <div className="text-gray-500">No question found</div>
      )}
    </div>
  )
}
