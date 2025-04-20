// src/components/Login.jsx
import React, { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await api.post('/users/sign_in.json', {
        'user[email]': email,
        'user[password]': password
      })
      onLogin(res.data) // { id, email }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-gray-100 dark:bg-gray-800 rounded"
    >
      <h2 className="text-xl mb-4">Log In</h2>
      {error && <div className="text-red-500">{error}</div>}
      <label className="block mb-2">
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded mt-1 bg-white dark:bg-gray-700"
          required
        />
      </label>
      <label className="block mb-4">
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded mt-1 bg-white dark:bg-gray-700"
          required
        />
      </label>
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded"
      >
        Sign In
      </button>
    </form>
  )
}
