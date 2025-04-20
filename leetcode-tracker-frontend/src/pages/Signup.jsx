import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState(''), [pw,setPw] = useState('')
  const nav = useNavigate()

  const submit = e => {
    e.preventDefault()
    fetch('/users.json', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({ user:{ email, password: pw, password_confirmation: pw } })
    })
    .then(r=>r.ok?nav('/') : alert('Signup failed'))
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl">Sign Up</h1>
      <input type="email" required placeholder="Email" value={email}
        onChange={e=>setEmail(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
      <input type="password" required placeholder="Password" value={pw}
        onChange={e=>setPw(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign Up</button>
    </form>
  )
}