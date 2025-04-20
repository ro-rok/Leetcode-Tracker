import api from '../api';

export default function PopulateButton({ companyId }) {
  const runImport = () => {
    api.post(`/companies/${companyId}/refresh`)
      .then(() => alert('Import kicked off!'))
      .catch(e => alert('Import failed: ' + e.message));
  };

  return (
    <button
      className="px-3 py-1 bg-yellow-500 text-white rounded"
      onClick={runImport}
    >
      Populate
    </button>
  );
}
