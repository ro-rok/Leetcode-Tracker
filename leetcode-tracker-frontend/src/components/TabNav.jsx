export default function TabNav({ active, onChange }) {
  const tabs = [
    { key: '30_days', label: '30 Days' },
    { key: '60_days', label: '3 Months' },
    { key: '90_days', label: '6 Months' },
    { key: 'more_than_six_months', label: '> 6 Months' },
    { key: 'all_time', label: 'All Time' },
  ];

  return (
    <div className="relative overflow-x-auto md:overflow-visible -mx-4 px-4 mb-6">
      <div className="flex space-x-3 w-max md:w-full justify-start md:justify-center">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 border-2 shadow-md ${
              active === t.key
                ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white border-blue-400'
                : 'bg-zinc-800 text-gray-300 border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
