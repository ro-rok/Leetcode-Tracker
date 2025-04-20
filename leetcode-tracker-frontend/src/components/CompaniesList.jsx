export default function CompanyList({ companies, selected, onSelect }) {
  return (
    <ul className="space-y-1">
      {companies.map(c => (
        <li key={c.id}>
          <button
            className={`w-full text-left px-2 py-1 rounded ${
              selected?.id === c.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-100'
            }`}
            onClick={() => onSelect(c)}
          >
            {c.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
