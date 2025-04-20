// src/App.jsx
import React, { useState } from 'react'
import DarkModeToggle from './components/DarkModeToggle.jsx'
import Login from './components/Login.jsx'
import Header from './components/Header.jsx'
import CompaniesList from './components/CompaniesList.jsx'
import QuestionsPanel from './components/QuestionsPanel.jsx'
import RandomPanel from './components/RandomPanel.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
        <DarkModeToggle />
        <CompaniesList onSelect={setCompany} selected={company?.id} />
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        <Header user={user} onLogout={() => { setUser(null); setCompany(null) }} />
        {company ? (
          <>
            <QuestionsPanel company={company} />
            <RandomPanel company={company} />
          </>
        ) : (
          <div className="text-center text-lg mt-20">
            Please select a company on the left
          </div>
        )}
      </main>
    </div>
  )
}
