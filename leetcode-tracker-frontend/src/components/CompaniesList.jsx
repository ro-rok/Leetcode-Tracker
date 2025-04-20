// src/components/CompaniesList.jsx
import React, { useState, useEffect } from 'react'
import api from '../api'

export default function CompaniesList({ onSelect, selected }) {
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    api.get('/companies.json')
      .then(res => setCompanies(res.data))
      .catch(console.error)
  }, [])

  return (
    <ul>
      {companies.map(c => (
        <li key={c.id} className="mb-1">
          <button
            className={`w-full text-left p-2 rounded ${
              selected === c.id
                ? 'bg-blue-200 dark:bg-blue-600 font-bold'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => onSelect(c)}
          >
            {c.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
