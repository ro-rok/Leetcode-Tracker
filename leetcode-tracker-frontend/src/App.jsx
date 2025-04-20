import { useState, useEffect } from 'react';
import api from './api';
import AuthForm from './components/AuthForm';
import CompaniesList from './components/CompaniesList';
import Filters from './components/Filters';
import PopulateButton from './components/PopulateButton';
import RandomQuestion from './components/RandomQuestion';
import QuestionList from './components/QuestionList';

export default function App() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [filters, setFilters] = useState({
    timeframe: '30_days',
    difficulty: '',
    topics: ''
  });
  const [questions, setQuestions] = useState([]);
  const [randomQ, setRandomQ] = useState(null);

  // load current user + companies
  useEffect(() => {
    api.get('/users/current.json')
      .then(r => setUser(r.data))
      .catch(() => setUser(null));
    api.get('/companies.json').then(r => setCompanies(r.data));
  }, []);

  // fetch questions via filters
  const fetchQuestions = () => {
    if (!company) return;
    api.get(`/companies/${company.id}/questions.json`, {
      params: { timeframe: filters.timeframe }
    }).then(r => setQuestions(r.data));
  };

  if (!user) return <AuthForm onAuth={u => setUser(u)} />;

  return (
    <div className="h-screen flex">
      <aside className="w-64 border-r overflow-y-auto p-4">
        <h2 className="font-bold mb-2">Companies</h2>
        <CompaniesList
          companies={companies}
          selected={company}
          onSelect={c => {
            setCompany(c);
            setQuestions([]);
            setRandomQ(null);
          }}
        />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {!company && <p>Please select a company.</p>}

        {company && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl">{company.name}</h1>
              <PopulateButton companyId={company.id} />
            </div>

            <Filters
              filters={filters}
              setFilters={setFilters}
              onFetch={fetchQuestions}
            />

            <div className="flex space-x-4 my-4">
              <RandomQuestion
                company={company}
                filters={filters}
                onRandom={q => setRandomQ(q)}
              />
            </div>

            {randomQ && (
              <div className="mb-6 p-4 bg-yellow-100 rounded">
                <h2 className="font-semibold">Random</h2>
                <a href={randomQ.link} target="_blank" className="underline">
                  {randomQ.title}
                </a>
                <div className="text-sm">
                  {randomQ.difficulty} · freq: {randomQ.frequency}
                </div>
              </div>
            )}

            <QuestionList
              questions={questions}
              onSolve={id =>
                setQuestions(questions.map(q =>
                  q.id === id ? { ...q, solved: true } : q
                ))
              }
            />
          </>
        )}
      </main>
    </div>
  );
}
