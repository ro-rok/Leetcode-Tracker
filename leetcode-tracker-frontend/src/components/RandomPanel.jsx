import React, { useState } from 'react'

export default function RandomPanel({ company }) {
  const [form, setForm] = useState({ timeframe:'30_days', difficulty:'EASY', topics:'' })
  const [result, setResult] = useState(null)

  const fetchRandom = () => {
    if (!company) return
    const q = new URLSearchParams({ ...form })
    fetch(`/companies/${company.id}/questions/random.json?${q}`, { credentials:'include' })
      .then(r=>r.status===204?null:r.json())
      .then(setResult)
  }

  return (
    <div>
      <h2 className="text-xl mb-2">Random Question</h2>
      <div className="space-x-2 mb-4">
        <select value={form.timeframe} onChange={e=>setForm({...form, timeframe:e.target.value})}>
          <option value="30_days">30 days</option>
          <option value="60_days">60 days</option>
          <option value="90_days">90 days</option>
          <option value="more_than_six_months">6 months</option>
          <option value="all_time">All time</option>
        </select>
        <select value={form.difficulty} onChange={e=>setForm({...form, difficulty:e.target.value})}>
          <option>EASY</option><option>MEDIUM</option><option>HARD</option>
        </select>
        <input
          type="text"
          placeholder="topics (comma)"
          className="px-2"
          value={form.topics}
          onChange={e=>setForm({...form, topics:e.target.value})}
        />
        <button onClick={fetchRandom} className="px-3 py-1 bg-indigo-500 text-white rounded">
          Go
        </button>
      </div>
      {result && (
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded">
          <a href={result.link} target="_blank" className="font-semibold underline">{result.title}</a>
          <div>{result.difficulty} · freq: {result.frequency}</div>
        </div>
      )}
    </div>
  )
}