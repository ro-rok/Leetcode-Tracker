import { useState, useEffect } from 'react'
import api from './api'
import LoginSignupForm from './components/LoginSignupForm'
import SearchBar from './components/SearchBar'
import LogoutButton from './components/LogoutButton'
import CompaniesList from './components/CompaniesList'
import TabNav from './components/TabNav'
import Filters from './components/Filters'
import PopulateButton from './components/PopulateButton'
import QuestionList from './components/QuestionList'
import SolveModal from './components/SolveModal'

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [companies, setCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favs')||'[]'))
  const [company, setCompany] = useState(null)
  const [activeTab, setActiveTab] = useState('30_days')
  const [filters, setFilters] = useState({ difficulty: [], topics: [] })
  const [questions, setQuestions] = useState([])
  const [randomQ, setRandomQ] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [chatQ, setChatQ] = useState(null);

  // load current user + companies
  useEffect(() => {
    api.get('/users/current.json')
      .then(r => setUser(r.data))
      .catch(() => setUser(null))
    api.get('/companies.json').then(r => setCompanies(r.data))
  }, [])

  // sort + search + favorites
  const shownCompanies = (() => {
    const filtered = companies.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const favs = filtered.filter(c => favorites.includes(c.id))
    const rest = filtered
      .filter(c => !favorites.includes(c.id))
      .sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    return [...favs, ...rest]
  })()

  const toggleFav = id => {
    const next = favorites.includes(id)
      ? favorites.filter(x=>x!==id)
      : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('favs', JSON.stringify(next))
  }

  // FETCH QUESTIONS whenever company or timeframe tabs change
  const fetchQuestions = () => {
    if (!company) return
    setLoading(true)
    setRandomQ(null)
    api.get(`/companies/${company.id}/questions.json`, {
      params: {
        timeframe: activeTab,
        difficulty: filters.difficulty.join(','),
        topics: filters.topics.join(',')
      }
    })
    .then(r => setQuestions(r.data))
    .catch(() => setQuestions([]))
    .finally(() => setLoading(false))
  }

  // fetch on tab or company change
  useEffect(() => {
    fetchQuestions()
  }, [company, activeTab])

  // RANDOM QUESTION on demand
  const getRandom = () => {
    if (!company) return
    setLoading(true)
    api.get(`/companies/${company.id}/questions/random.json`, {
      params: {
        timeframe: activeTab,
        difficulty: filters.difficulty.join(','),
        topics: filters.topics.join(',')
      }
    })
    .then(r => setRandomQ(r.data))
    .catch(() => setRandomQ(null))
    .finally(() => setLoading(false))
  }

  // start solving
  const startSolve = q => {
    if (!user) return setShowAuth(true)
    window.open(q.link, '_blank')
    setModal({ question: q, shown: false })
  }

  // finish solve/unsolve via modal
  const finishSolve = async solved => {
    const { question } = modal
    if (solved) {
      await api.post(`/questions/${question.id}/solve.json`)
    }
    // update in list
    setQuestions(qs =>
      qs.map(x => x.id === question.id ? { ...x, solved } : x)
    )
    if (randomQ?.id === question.id) {
      setRandomQ(r => r ? { ...r, solved } : null)
    }
    setModal(null)
  }

  // direct unsolve from random card
  const unSolveRandom = async () => {
    if (!randomQ) return
    await api.delete(`/questions/${randomQ.id}/solve.json`)
    setRandomQ(r => r ? { ...r, solved: false } : null)
  }

  // reset progress
  const resetProgress = async () => {
    if (!user) return setShowAuth(true)
    if (!confirm('Reset all progress for this company?')) return
    await api.post('/users/reset_progress.json', { company_id: company.id })
    if (activeTab === 'random') {
            getRandom()
          } else {
            // fetch list again
            setLoading(true)
            api.get(`/companies/${company.id}/questions.json`, {
              params: { timeframe: activeTab, difficulty: filters.difficulty.join(','), topics: filters.topics.join(',') }
            })
            .then(r => setQuestions(r.data))
            .finally(() => setLoading(false))
          }
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <aside className="w-72 p-4 border-r border-gray-700">
        <div className="mb-4">
          {user ? (
            <>
              <span className="font-medium">{user.email.split('@')[0]}</span>
              <LogoutButton onLogout={()=>{
                api.delete('/users/sign_out.json')
                setUser(null)
              }}/>
            </>
          ) : (
            <button
              className="px-3 py-1 bg-blue-600 rounded"
              onClick={()=>setShowAuth(true)}
            >
              Login / Sign Up
            </button>
          )}
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm}/>
        <CompaniesList
          companies={shownCompanies}
          selected={company}
          onSelect={c=>{ setCompany(c); setActiveTab('30_days') }}
          favorites={favorites}
          onToggleFav={toggleFav}
        />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {!company ? (
          <p className="text-center mt-20">Please select a company.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl">{company.name}</h1>
              <PopulateButton companyId={company.id}/>
            </div>

            <TabNav active={activeTab} onChange={setActiveTab}/>

            <Filters
              filters={filters}
              setFilters={setFilters}
              onFetch={fetchQuestions}
              onRandom={getRandom}
            />

            {loading && (
              <div className="text-center mt-6">Loading…</div>
            )}

            {/* RANDOM CARD */}
            {randomQ && !loading && (
              <div className="mb-6 p-4 bg-gray-800 rounded">
                <a
                  href={randomQ.link}
                  target="_blank"
                  className="underline text-lg text-yellow-300"
                >
                  {randomQ.title}
                </a>
                <div className="mt-2">
                  {randomQ.difficulty} · freq: {randomQ.frequency}
                </div>
                {randomQ.solved ? (
                  <button
                    onClick={unSolveRandom}
                    className="mt-2 bg-red-600 px-3 py-1 rounded"
                  >
                    Unsolve
                  </button>
                ) : (
                  <button
                    onClick={()=>startSolve(randomQ)}
                    className="mt-2 bg-blue-600 px-3 py-1 rounded"
                  >
                    Solve
                  </button>
                )}
              </div>
            )}

            {/* only show reset if logged in */}
            {user && (
              <button
                className="mb-2 text-sm underline"
                onClick={resetProgress}
              >
                Reset Progress
              </button>
            )}

            {/* QUESTION LIST */}
            {!loading && (
              <QuestionList
                questions={questions}
                onSolve={startSolve}
                onUnsolve={id => {
                  api.delete(`/questions/${id}/solve.json`)
                  setQuestions(qs =>
                    qs.map(q => q.id === id ? { ...q, solved: false } : q)
                  )
                }}
                onChat={q=>setChatQ(q)}
              />
            )}

            
          </>
        )}
      </main>

      <SolveModal
        open={!!modal && !modal.shown}
        question={modal?.question}
        onClose={finishSolve}
      />

    <ChatModal
      open={!!chatQ}
      question={chatQ}
      onClose={closeChat}
    />

      {showAuth && (
        <LoginSignupForm
          onAuth={u => { setUser(u); setShowAuth(false) }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}
