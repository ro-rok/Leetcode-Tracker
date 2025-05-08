import { useState, useEffect, useCallback, useRef } from 'react'
import api from './api'
import LoginSignupForm from './components/LoginSignupForm'
import LogoutButton from './components/LogoutButton'
import TabNav from './components/TabNav'
import Filters from './components/Filters'
import PopulateButton from './components/PopulateButton'
import QuestionList from './components/QuestionList'
import SolveModal from './components/SolveModal'
import ChatModal from './components/ChatModal'
import RandomQuestionCard from './components/RandomQuestion'
import Homepage from './components/Homepage'

function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search companies..."
      className="w-full px-3 py-2 mb-4 rounded-md bg-zinc-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function CompaniesList({ companies, selected, onSelect, favorites, onToggleFav }) {
  return (
    <ul className="space-y-1 overflow-y-auto h-[calc(100vh-150px)] pr-1 sm:scrollbar-thin sm:scrollbar-thumb-zinc-700 sm:scrollbar-track-zinc-900 custom-scroll">
      {companies.map(c => (
        <li key={c.id} className="group flex items-center justify-between px-2 py-1 rounded-md hover:bg-zinc-800 transition-all cursor-pointer">
          <button
            className={`flex-1 text-left truncate text-sm font-medium transition-colors duration-150 ${
              selected?.id === c.id ? 'text-blue-400 font-semibold' : 'text-gray-300 group-hover:text-white'
            }`}
            onClick={() => onSelect(c)}
          >
            {c.name}
          </button>
          <button
            onClick={() => onToggleFav(c.id)}
            className="text-yellow-400 text-sm hover:scale-110 transform transition-transform"
            aria-label="Toggle favorite"
          >
            {favorites.includes(c.id) ? '★' : '☆'}
          </button>
        </li>
      ))}
    </ul>
  );
}

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
  const [modal, setModal] = useState(null)
  const [chatQ, setChatQ] = useState(null);
  const [topics, setTopics] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!company) return;
    api.get(`/companies/${company.id}/topics.json`)
      .then(r => setTopics(r.data))
      .catch(() => setTopics([]));
  }, [company]);

  useEffect(() => {
    // Try to get user from localStorage first
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
  
    // Still try to fetch from API
    api.get('/users/current.json')
      .then(r => {
        setUser(r.data);
        localStorage.setItem('currentUser', JSON.stringify(r.data));
      })
      .catch(() => {
        // Only clear if we don't already have a user
        if (!savedUser) {
          setUser(null);
          localStorage.removeItem('currentUser');
        }
      });
    
    api.get('/companies.json').then(r => setCompanies(r.data));
  }, []);

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

    // Create a single source of truth for fetching
  const fetchQuestionsRef = useRef(null);

 const fetchQuestions = useCallback(() => {
    if (!company) return;
    console.log('🔁 Fetching questions...');
    setRandomQ(null);
    
    api.get(`/companies/${company.id}/questions.json`, {
      params: {
        timeframe: activeTab,
        difficulty: filters.difficulty.join(','),
        user_id: user?.id
      }
    })
    .then(r => setQuestions(r.data))
    .catch(() => setQuestions([]));
  }, [company, activeTab, filters.difficulty, user?.id]);

  useEffect(() => {
    if (!company) return;
    
    console.log('📊 Data dependencies changed - debouncing fetch');
    
    if (fetchQuestionsRef.current) {
      clearTimeout(fetchQuestionsRef.current);
    }

    fetchQuestionsRef.current = setTimeout(() => {
      console.log('⏱️ Executing fetch after debounce');
      fetchQuestions();
    }, 300); 
    
    return () => {
      if (fetchQuestionsRef.current) {
        clearTimeout(fetchQuestionsRef.current);
        fetchQuestionsRef.current = null;
      }
    };
  }, [company?.id, activeTab, filters.difficulty, user?.id]);

  const getRandom = () => {
    if (!company) return
    api.get(`/companies/${company.id}/questions/random.json`, {
      params: {
        timeframe: activeTab,
        difficulty: filters.difficulty.join(','),
        topics: filters.topics.join(','),
        user_id: user?.id
      }
    })
    .then(r => setRandomQ(r.data))
    .catch(() => setRandomQ(null))
  }

  const startSolve = q => {
    if (!user) return setShowAuth(true)
    window.open(q.link, '_blank')
    setModal({ question: q, shown: false })
  }

  const finishSolve = async solved => {
    const { question } = modal
    if (solved) {
      await api.post(`/questions/${question.id}/solve.json?user_id=${user.id}`)
    }
    setQuestions(qs =>
      qs.map(x => x.id === question.id ? { ...x, solved } : x)
    )
    if (randomQ?.id === question.id) {
      setRandomQ(r => r ? { ...r, solved } : null)
    }
    setModal(null)
  }

  const unSolveRandom = async () => {
    if (!randomQ) return
    await api.delete(`/questions/${randomQ.id}/solve.json`)
    setRandomQ(r => r ? { ...r, solved: false } : null)
  }

  const resetProgress = async () => {
    if (!user) return setShowAuth(true)
    if (!confirm('Reset all progress for this company?')) return
    await api.post('/users/reset_progress.json', { company_id: company.id, user_id: user.id })
    fetchQuestions()
  }

  const closeChat = () => {
    setChatQ(null)
  }

  return (
    <div className="h-screen flex flex-col sm:flex-row bg-black text-white">
      <aside className={`sm:w-72 w-full sm:block ${sidebarOpen ? 'block' : 'hidden'} sm:border-r border-gray-700 bg-gray-950 p-4 transition-all duration-300 z-40 sm:z-auto`}> 
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <h2 className="text-xl font-bold pl-14">Companies</h2>
          <button
            className="text-sm text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >✕</button>
        </div>

        <div className="mb-4">
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">👤 {user.email.split('@')[0]}</span>
              <LogoutButton onLogout={() => {
                api.delete('/users/sign_out.json')
                setUser(null)
              }} />
            </div>
          ) : (
            <button
              className="px-3 py-1 bg-blue-600 rounded"
              onClick={() => setShowAuth(true)}
            >Login / Sign Up</button>
          )}
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CompaniesList
          companies={shownCompanies}
          selected={company}
          onSelect={c => { setCompany(c); setActiveTab('30_days'); setSidebarOpen(false); }}
          favorites={favorites}
          onToggleFav={toggleFav}
        />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        <button
          className="sm:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white px-3 py-1 rounded shadow"
          onClick={() => setSidebarOpen(true)}
        >☰</button>

        {!company ? (
          <Homepage />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold ml-10 sm:ml-0">{company.name}</h1>
              <PopulateButton companyId={company.id} onRefresh={fetchQuestions} />
            </div>

            <TabNav active={activeTab} onChange={setActiveTab} />

            <Filters
              filters={filters}
              setFilters={setFilters}
              onFetch={() => {}}
              onRandom={getRandom}
              topics={topics}
            />

            {randomQ  && (
              <RandomQuestionCard
                question={randomQ}
                onSolve={startSolve}
                onUnsolve={unSolveRandom}
                onChat={q => setChatQ(q)}
              />
            )}

            {user && (
              <div className="flex items-center justify-between mb-2 text-sm">
                <button
                  className="underline text-red-500 hover:text-red-400"
                  onClick={resetProgress}
                >
                  Reset Progress
                </button>
                {questions.length !== 0 && (
                  <div className="text-right text-gray-400">
                    Solved <span className="font-semibold text-green-400">{questions.filter(q => q.solved).length}</span> out of <span className="font-semibold text-blue-400">{questions.length}</span> questions.
                  </div>
                )}
              </div>
            )}

            <QuestionList
              questions={questions}
              onSolve={startSolve}
              onUnsolve={id => {
                api.delete(`/questions/${id}/solve.json?user_id=${user.id}`)
                setQuestions(qs =>
                  qs.map(q => q.id === id ? { ...q, solved: false } : q)
                )
              }}
              onChat={q => setChatQ(q)}
            />
          
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
