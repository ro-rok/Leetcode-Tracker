export default function CompanyList({ companies, onSelect }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Companies</h2>
        <ul className="grid grid-cols-2 gap-2">
          {companies.map(c => (
            <li key={c.id}>
              <button
                className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => onSelect(c)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  