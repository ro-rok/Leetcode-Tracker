import React from 'react'

export default function DarkModeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle('dark')
  }
  return (
    <button onClick={toggle} className="mb-4 px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded">
      Toggle Dark Mode
    </button>
  )
}
