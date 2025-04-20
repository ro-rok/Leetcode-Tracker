import { useState, useEffect } from 'react'

export default function Questions({ company }) {
  const [qs, setQs]     = useState([])
  const [rand, setRand] = useState(null)

  const load = () => {
    fetch(`/companies/${company.id}/questions.json?timeframe=30_days`,
      { credentials:'include' })
      .then(r=>r.json()).then(setQs)
  }
  useEffect(load, [company])

  const solve = async id => {
    await fetch(`/questions/${id}/solve.json`, {
      method:'POST', credentials:'include'
    })
    load()
  }

  const random = async () => {
    const r = await fetch(
      `/companies/${company.id}/questions/random.json?timeframe=30_days`,
      { credentials:'include' }
    )
    if (r.status===204) setRand({ title: 'none left' })
    else {
      const j = await r.json()
      setRand(j)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{company.name} Questions</h2>
        <button onClick={random}
          className="bg-green-500 text-white px-3 py-1 rounded">
          Random
        </button>
      </div>

      {rand &&
        <div className="bg-yellow-100 p-3 rounded">
          <a href={rand.link} target="_blank">{rand.title}</a>
        </div>
      }

      <ul className="space-y-2">
        {qs.map(q =>
          <li key={q.id} className="bg-white p-3 rounded shadow flex justify-between">
            <div>
              <a href={q.link} target="_blank" className="font-medium">{q.title}</a>
              <div className="text-sm text-gray-600">
                {q.difficulty} · freq: {q.frequency} · solved: {q.solved ? '✅' : '❌'}
              </div>
            </div>
            {!q.solved &&
              <button onClick={()=>solve(q.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded">
                Solve
              </button>
            }
          </li>
        )}
      </ul>
    </div>
  )
}
