import { useState, useEffect } from 'react'
import CompanyList from './components/CompanyList'
import QuestionList from './components/QuestionList'
import RandomQuestion from './components/RandomQuestion'

export default function App() {
  const [companies, setCompanies] = useState([])
  const [session, setSession] = useState(null)       // store cookies
  const [selected, setSelected] = useState(null)     // { companyId, timeframe, difficulty, topics }

  useEffect(() => {
    fetch('/companies.json')
      .then(r => r.json())
      .then(setCompanies)
  }, [])

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">LeetCode Tracker</h1>
      <CompanyList
        companies={companies}
        onSelect={c => setSelected({ companyId: c.id, timeframe: '30_days', difficulty: 'EASY', topics: '' })}
      />
      {selected && (
        <>
          <QuestionList
            companyId={selected.companyId}
            timeframe={selected.timeframe}
            session={session}
          />
          <RandomQuestion
            companyId={selected.companyId}
            timeframe={selected.timeframe}
            difficulty={selected.difficulty}
            topics={selected.topics}
            session={session}
          />
        </>
      )}
    </div>
  )
}
