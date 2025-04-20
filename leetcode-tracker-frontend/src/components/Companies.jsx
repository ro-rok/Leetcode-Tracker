import { useState, useEffect } from 'react'
import Questions from './Questions'

export default function Companies({ user }) {
  const [companies, setCompanies] = useState([])
  const [active, setActive]       = useState(null)

  useEffect(()=>{
    fetch('/companies.json', { credentials:'include' })
      .then(r=>r.json()).then(setCompanies)
  },[])

  return (
    <div className="flex space-x-4">
      <ul className="w-1/3 bg-white p-4 rounded shadow max-h-screen overflow-auto">
        {companies.map(c =>
          <li key={c.id}>
            <button
              className={`block text-left w-full p-2 rounded hover:bg-gray-100 ${
                active?.id === c.id ? 'bg-blue-100' : ''
              }`}
              onClick={()=> setActive(c)}>
              {c.name}
            </button>
          </li>
        )}
      </ul>
      <div className="w-2/3">
        {active
          ? <Questions company={active}/>
          : <div className="text-gray-500">Select a company</div>
        }
      </div>
    </div>
  )
}
