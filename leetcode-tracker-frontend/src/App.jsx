// src/App.jsx
import React, { useState, useEffect } from 'react'
import CompaniesList from './components/CompaniesList'
import QuestionsPanel from './components/QuestionsPanel'
import RandomPanel from './components/RandomPanel'
import DarkModeToggle from './components/DarkModeToggle'

export default function App() {
  const [company, setCompany] = useState(null)

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-auto">
        <DarkModeToggle />
        <CompaniesList onSelect={setCompany} selected={company?.id} />
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {company
          ? <QuestionsPanel company={company} />
          : <div>Select a company to see its questions</div>}
        <hr className="my-6 border-gray-300 dark:border-gray-700"/>
        <RandomPanel company={company} />
      </main>
    </div>
  )
}
