import React from 'react'

export default function DarkModeToggle() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDark(saved)
    document.documentElement.classList.toggle('dark', saved)
    }, [])

    const toggle = () => {
    const nxt = !dark
    localStorage.setItem('darkMode', nxt)
    setDark(nxt)
    document.documentElement.classList.toggle('dark', nxt)
    }
  return (
    <button onClick={toggle} className="mb-4 px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded">
      Toggle Dark Mode
    </button>
  )
}
