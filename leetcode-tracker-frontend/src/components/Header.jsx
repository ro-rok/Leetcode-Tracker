// src/components/Header.jsx
import React from 'react'
import api from '../api'

export default function Header({ user, onLogout }) {
  const username = user.email.split('@')[0]

  const handleLogout = async () => {
    await api.delete('/users/sign_out.json')
    onLogout()
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <div>Hello, <strong>{username}</strong></div>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 dark:bg-red-400 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}
