import { useEffect } from 'react';

export default function Filters({ filters, setFilters, onFetch, onRandom }) {
  useEffect(() => {
    const saved = localStorage.getItem('filters');
    if (saved) setFilters(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
    onFetch();
  }, [filters]);

  const setDifficulty = (val) => {
    setFilters(f => ({
      ...f,
      difficulty: f.difficulty[0] === val ? [] : [val]
    }));
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex gap-2">
        <div className="text-m text-gray-400 px-4 py-1.5">Difficulty:</div>
        {['easy', 'medium', 'hard'].map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize font-medium transition-all duration-200 ring-1 ring-inset
              ${filters.difficulty.includes(d)
                ? 'bg-blue-600 text-white ring-blue-400 shadow-md'
                : 'bg-zinc-800 text-gray-300 ring-zinc-600 hover:bg-zinc-700 hover:text-white'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRandom}
          className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow transition"
        >
          🎲 Random
        </button>
        {/* <button
          onClick={() => setFilters({ difficulty: [], topics: [] })}
          className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition"
        >
          Clear
        </button> */}
        <button
          onClick={onFetch}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
