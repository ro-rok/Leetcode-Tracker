export default function CompaniesList({ companies, selected, onSelect, favorites, onToggleFav }) {
  return (
    <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
      {companies.map(c => (
        <li key={c.id} className="flex items-center justify-between">
          <button
            className={`flex-1 text-left px-2 py-1 rounded ${
              selected?.id === c.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-700'
            }`}
            onClick={() => onSelect(c)}
          >
            {c.name}
          </button>
          <button onClick={()=>onToggleFav(c.id)} className="ml-2">
            {favorites.includes(c.id) ? '★' : '☆'}
          </button>
        </li>
      ))}
    </ul>
  );
}
