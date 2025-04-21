export default function SearchBar({ value, onChange }) {
    return (
      <input
        className="w-full p-2 mb-3 rounded bg-gray-700 text-gray-100"
        placeholder="Search companies…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  