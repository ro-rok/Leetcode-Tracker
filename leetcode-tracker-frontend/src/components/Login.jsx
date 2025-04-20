import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handle = async e => {
    e.preventDefault()
    setError('')
    const res = await fetch('/users/sign_in.json', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ user: { email, password } })
    })
    if (res.ok) {
      const u = await res.json()
      onLogin(u)          // { id, email }
    } else {
      const err = await res.json().catch(()=>({error:'Bad'}))
      setError(err.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">Sign In</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block">Email</label>
        <input type="email" value={email}
          onChange={e=>setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required/>
      </div>
      <div>
        <label className="block">Password</label>
        <input type="password" value={password}
          onChange={e=>setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required/>
      </div>
      <button type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Log In
      </button>
    </form>
  )
}
