import { useState, useEffect } from 'react'
import Login from './components/Login'
import Companies from './components/Companies'

export default function App() {
  const [user, setUser] = useState(null)

  // On mount, you could check /users/current.json if you have that.
  // For simplicity we just show login until they log in.

  return (
    <div className="max-w-3xl mx-auto p-4">
      {user
        ? <Companies user={user}/>
        : <Login onLogin={setUser}/>
      }
    </div>
  )
}
