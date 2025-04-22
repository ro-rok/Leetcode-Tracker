import { useEffect, useState } from 'react';

export default function Filters({ filters, setFilters, onFetch, onRandom, topics = [] }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('filters');
    if (saved) setFilters(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  const toggle = (arrKey, val) => {
    setFilters(f => {
      const has = f[arrKey].includes(val);
      const next = has ? f[arrKey].filter(x => x !== val) : [...f[arrKey], val];
      return { ...f, [arrKey]: next };
    });
  };

  const clearFilters = () => setFilters({ difficulty: [], topics: [] });

  return (
    <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Difficulty</h4>
            <div className="flex gap-2 flex-wrap">
              {['easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  onClick={() => toggle('difficulty', d)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-all ${
                    filters.difficulty.includes(d)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Topics</h4>
            <div className="max-h-40 overflow-y-auto pr-1 flex flex-wrap gap-2">
              {topics.length === 0 ? (
                <span className="text-gray-500 text-sm">Loading topics…</span>
              ) : (
                topics.map(t => (
                  <button
                    key={t}
                    onClick={() => toggle('topics', t)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filters.topics.includes(t)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 justify-end border-t border-gray-700 pt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          Clear Filters
        </button>
        <button
          onClick={onFetch}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Fetch List
        </button>
        <button
          onClick={onRandom}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
        >
          🎲 Get Random
        </button>
      </div>
    </div>
  );
}