// src/components/CompaniesList.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CompaniesList({ onSelect, selected }) {
  const [list, setList] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    fetch('/companies.json')
      .then(r => r.json())
      .then(setList)
  }, [])

  return (
    <ul>
      {list.map(c => (
        <li key={c.id}>
          <button
            onClick={() => { onSelect(c); nav(`/companies/${c.id}`) }}
            className={`w-full text-left px-2 py-1 rounded ${
              selected === c.id ? 'bg-blue-400 text-white' : 'hover:bg-blue-200 dark:hover:bg-blue-600'
            }`}
          >
            {c.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
