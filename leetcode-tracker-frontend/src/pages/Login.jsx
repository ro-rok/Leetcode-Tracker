import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState(''), [pw,setPw] = useState('')
  const nav = useNavigate()

  const submit = e => {
    e.preventDefault()
    fetch('/users/sign_in.json', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({ user:{ email, password: pw } })
    })
    .then(r=>r.ok?nav('/') : alert('Login failed'))
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl">Login</h1>
      <input type="email" required placeholder="Email" value={email}
        onChange={e=>setEmail(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
      <input type="password" required placeholder="Password" value={pw}
        onChange={e=>setPw(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Login</button>
    </form>
  )
}