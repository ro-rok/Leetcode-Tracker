// src/components/TabNav.jsx
export default function TabNav({ active, onChange }) {
    const tabs = [
      { key: '30_days', label: '30 Days' },
      { key: '60_days', label: '3 Months' },
      { key: '90_days', label: '6 Months' },
      { key: 'more_than_six_months', label: '> 6 Months' },
      { key: 'all_time', label: 'All Time' },
    ]
  
    return (
      <div className="flex space-x-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={()=>onChange(t.key)}
            className={`px-3 py-1 rounded ${
              active===t.key
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    )
  }
  