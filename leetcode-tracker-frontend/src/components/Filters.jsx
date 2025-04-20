export default function Filters({ filters, setFilters, onFetch }) {
    const { timeframe, difficulty, topics } = filters;
  
    return (
      <div className="flex items-center space-x-3">
        <select
          className="p-1 border"
          value={timeframe}
          onChange={e => setFilters(f => ({ ...f, timeframe: e.target.value }))}
        >
          <option value="30_days">30 Days</option>
          <option value="60_days">3 Months</option>
          <option value="90_days">6 Months</option>
          <option value="more_than_six_months">&gt;6 Months</option>
          <option value="all_time">All Time</option>
        </select>
  
        <select
          className="p-1 border"
          value={difficulty}
          onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}
        >
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
  
        <input
          className="p-1 border flex-1"
          placeholder="Topics (comma‑sep)"
          value={topics}
          onChange={e => setFilters(f => ({ ...f, topics: e.target.value }))}
        />
  
        <button
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={onFetch}
        >
          Fetch Questions
        </button>
      </div>
    );
  }
  