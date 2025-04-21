const DIFFICULTIES = ['easy', 'medium', 'hard'];
const TOPICS = [
  'Array', 'Hash Table', 'Two Pointers', 'String', 'Dynamic Programming',
  'Depth-First Search', 'Breadth-First Search', 'Graph', 'Math', 'Sorting',
  // …add more here
];

export default function Filters({ filters, setFilters, onFetch, onRandom }) {
  const toggle = (arrKey, val) => {
    setFilters(f => {
      const has = f[arrKey].includes(val);
      const next = has
        ? f[arrKey].filter(x => x !== val)
        : [...f[arrKey], val];
      return { ...f, [arrKey]: next };
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <h4 className="font-semibold mb-1">Difficulty</h4>
        {DIFFICULTIES.map(d => (
          <label key={d} className="block">
            <input
              type="checkbox"
              checked={filters.difficulty.includes(d)}
              onChange={() => toggle('difficulty', d)}
            />
            <span className="ml-2 capitalize">{d}</span>
          </label>
        ))}
      </div>

      <div className="col-span-2">
        <h4 className="font-semibold mb-1">Topics</h4>
        <div className="grid grid-cols-2 gap-2">
          {TOPICS.map(t => (
            <label key={t}>
              <input
                type="checkbox"
                checked={filters.topics.includes(t)}
                onChange={() => toggle('topics', t)}
              />
              <span className="ml-2">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="col-span-3 text-right space-x-2">
        <button
          onClick={onFetch}
          className="px-4 py-2 bg-green-600 rounded text-white"
        >
          Fetch List
        </button>
        <button
          onClick={onRandom}
          className="px-4 py-2 bg-purple-600 rounded text-white"
        >
          Get Random
        </button>
      </div>
    </div>
  );
}
