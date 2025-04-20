import { useState, useEffect } from 'react'

export default function QuestionList({ companyId, timeframe, session }) {
  const [qs, setQs] = useState([])

  useEffect(() => {
    fetch(`/companies/${companyId}/questions.json?timeframe=${timeframe}`)
      .then(r => r.json())
      .then(setQs)
  }, [companyId, timeframe])

  const toggleSolve = async (id, solved) => {
    const method = solved ? 'DELETE' : 'POST'
    await fetch(`/questions/${id}/solve.json`, {
      method,
      credentials: 'include'
    })
    setQs(qs.map(q => q.id === id ? { ...q, solved: !solved } : q))
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Questions</h2>
      <ul className="space-y-2">
        {qs.map(q => (
          <li key={q.id} className="p-2 bg-white rounded shadow-sm flex justify-between">
            <div>
              <a href={q.link} target="_blank" className="font-medium">{q.title}</a>
              <div className="text-sm text-gray-600">
                {q.difficulty} · freq: {q.frequency} · solved: {q.solved ? '✅' : '❌'}
              </div>
            </div>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => toggleSolve(q.id, q.solved)}
            >
              {q.solved ? 'Uns​olve' : 'Solve'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
