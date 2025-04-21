import { useState } from 'react';
import api from '../api';

export default function ChatModal({ open, question, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput]     = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState(null);

  if (!open || !question) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    setError(null);
    const userMsg = input;
    setHistory(h => [...h, { from: 'user', text: userMsg }]);
    setInput('');

    try {
      const res = await api.post(
        `/questions/${question.id}/chat.json`,
        { message: userMsg }
      );
      if (res.data.reply) {
        setHistory(h => [...h, { from: 'ai', text: res.data.reply }]);
      }
    } catch (e) {
      if (e.response?.status === 429) setError('Rate limit exceeded.');
      else setError('AI service error.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop z-50">
      <div className="modal-card max-w-xl">
        <h2 className="font-bold mb-2">Chat about “{question.title}”</h2>
        <div className="chat-history mb-4 overflow-y-auto max-h-64">
          {history.map((m,i)=>(
            <div key={i} className={m.from==='user'?'text-right':'text-left'}>
              <span className={`inline-block p-2 rounded ${
                m.from==='user'? 'bg-blue-600':'bg-gray-700'
              }`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 rounded bg-gray-800"
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Paste code or ask a question…"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 rounded"
            disabled={sending}
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
        <button
          onClick={()=>onClose()}
          className="mt-3 text-sm underline"
        >Close Chat</button>
      </div>
    </div>
  );
}
