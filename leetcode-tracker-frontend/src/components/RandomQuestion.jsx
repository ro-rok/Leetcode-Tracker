import api from '../api';

export default function RandomQuestion({ company, filters, onRandom }) {
  const getRandom = () => {
    api.get(`/companies/${company.id}/questions/random.json`, {
      params: filters
    })
    .then(r => onRandom(r.data))
    .catch(() => alert('No random found'));
  };

  return (
    <button
      className="px-3 py-1 bg-purple-600 text-white rounded"
      onClick={getRandom}
    >
      Get Random
    </button>
  );
}
