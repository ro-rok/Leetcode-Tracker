// src/components/QuestionsPanel.jsx
import React, { useState, useEffect } from 'react'
import api from '../api'

export default function QuestionsPanel({ company }) {
  const [timeframe, setTimeframe] = useState('30_days')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    api.get(`/companies/${company.id}/questions.json`, {
      params: { timeframe }
    })
      .then(res => setQuestions(res.data))
      .catch(console.error)
  }, [company.id, timeframe])

  const handleSolve = q => {
    const win = window.open(q.link, '_blank')
    const timer = setInterval(async () => {
      if (win.closed) {
        clearInterval(timer)
        await api.post(`/questions/${q.id}/solve.json`)
        setQuestions(questions.map(x =>
          x.id === q.id ? { ...x, solved: true } : x
        ))
        alert(`Marked solved: ${q.title}`)
      }
    }, 500)
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg mb-2">{company.name} Questions</h2>
      <select
        value={timeframe}
        onChange={e => setTimeframe(e.target.value)}
        className="mb-4 p-2 rounded bg-white dark:bg-gray-700"
      >
        <option value="30_days">Last 30 days</option>
        <option value="60_days">Last 60 days</option>
        <option value="90_days">Last 90 days</option>
        <option value="more_than_six_months">&gt; 6 months</option>
        <option value="all_time">All time</option>
      </select>
      <ul>
        {questions.map(q => (
          <li key={q.id} className="flex justify-between mb-2">
            <div>
              <a
                href={q.link}
                target="_blank"
                rel="noopener"
                className="underline"
              >
                {q.title}
              </a>
              <span className="ml-2 text-sm text-gray-500">
                {q.difficulty} · freq: {q.frequency} · solved: {q.solved ? '✅' : '❌'}
              </span>
            </div>
            <button
              onClick={() => handleSolve(q)}
              disabled={q.solved}
              className="px-3 py-1 bg-green-500 dark:bg-green-400 text-white rounded disabled:opacity-50"
            >
              Solve
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
