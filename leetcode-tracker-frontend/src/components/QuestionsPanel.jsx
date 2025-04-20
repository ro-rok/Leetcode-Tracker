import React, { useState, useEffect, useRef } from 'react'
import api from '../api'

const TIMEFRAMES = ['30_days','60_days','90_days','more_than_six_months','all_time']

export default function QuestionsPanel({ company }) {
  const [tf, setTf] = useState(TIMEFRAMES[0])
  const [qs, setQs] = useState([])
  const popupRef = useRef(null)

  useEffect(() => {
    const url = tf === 'all_time'
        ? `/companies/${company.id}/questions.json`
        : `/companies/${company.id}/questions.json?timeframe=${tf}`
        api.get(url)
        .then(r => setQs(r.data))
        .catch(console.error)
  }, [company, tf])

  const onSolveClick = q => {
    // open external tab
    popupRef.current = window.open(q.link, '_blank')
        // wait for user to return
        const handler = () => {
          if (popupRef.current?.closed) {
            window.removeEventListener('focus', handler)
            popupRef.current = null
            if (window.confirm(`Mark "${q.title}" solved?`)) {
              api.post(`/questions/${q.id}/solve.json`)
                .then(() => setQs(qs.map(x => x.id===q.id?{ ...x, solved: true }: x)))
            }
          }
        }
        window.addEventListener('focus', handler)
  }

  return (
    <div>
      <h2 className="text-xl mb-2">{company.name} Questions</h2>
      <div className="mb-4 space-x-2">
        {TIMEFRAMES.map(t => (
          <button
            key={t}
            onClick={()=>setTf(t)}
            className={`px-2 py-1 rounded ${
              tf===t ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >{t.replace(/_/g,' ')}</button>
        ))}
      </div>
      <ul>
        {qs.map(q=>(
          <li key={q.id} className="mb-2 flex justify-between items-center">
            <div>
              <div className="font-semibold">{q.title}</div>
              <div className="text-sm">{q.difficulty} · freq: {q.frequency} · solved: {q.solved?'✅':'❌'}</div>
            </div>
            <button
              disabled={q.solved}
              onClick={()=>onSolveClick(q)}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {q.solved ? 'Solved' : 'Solve'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
