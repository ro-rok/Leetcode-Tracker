import { useState } from 'react';
import api from '../api';

export default function PopulateButton({ companyId }) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await api.post(`/companies/${companyId}/refresh`);
      alert('Import kicked off!');
    } catch(e) {
      alert('Import failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={run}
      disabled={busy}
      className={`px-3 py-1 rounded ${
        busy ? 'bg-yellow-300' : 'bg-yellow-500 hover:bg-yellow-600'
      } text-gray-900`}
    >
      {busy ? '…' : 'Populate'}
    </button>
  );
}
