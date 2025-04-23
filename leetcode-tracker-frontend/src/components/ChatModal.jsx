import { useState, useEffect, useRef } from 'react';
import api from '../api';
import LoaderHamster from './LoaderHamster';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatModal({ open, question, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const storageKey = `chat-history-${question?.id}`;

  useEffect(() => {
    if (autoScroll) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, autoScroll]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      setHistory([]);
    }
  }, [question?.id]);

  useEffect(() => {
    if (question?.id && history.length > 0) {
      const limited = history.slice(-10);
      localStorage.setItem(storageKey, JSON.stringify(limited));
    }
  }, [history]);

  if (!open || !question) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    setError(null);
    const userMsg = input;
    const newHistory = [...history, { from: 'user', text: userMsg }];
    setHistory(newHistory);
    setInput('');

    let attempt = 0;
    const maxRetries = 3;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        const res = await api.post(`/questions/${question.id}/chat.json`, { message: userMsg, credentials: "include", });
        if (res.data.reply) {
          setHistory(h => [...h, { from: 'ai', text: res.data.reply }]);
        }
        if (res.data.usage) {
          setHistory(h => [
            ...h,
            {
              from: 'system',
              text: `📊 Tokens Left: ${res.data.usage.tokens_left} / ${res.data.usage.token_limit} • Requests Left: ${res.data.usage.requests_left} / ${res.data.usage.request_limit}`
            }
          ]);
        }
        success = true;
      } catch (e) {
        attempt++;
        if (attempt === maxRetries) {
          setError('AI service error after 3 retries.');
        }
      } finally {
        setSending(false);
      }
    }
  };

  const clearChat = () => {
    setHistory([]);
    localStorage.removeItem(storageKey);
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      return !inline && match ? (
        <div className="relative">
          <button
            className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-700"
            onClick={() => navigator.clipboard.writeText(codeText)}
          >
            Copy
          </button>
          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
            {codeText}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white w-full max-w-2xl rounded-2xl shadow-xl p-6 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="font-bold text-xl">Ask AI: “{question.title}”</h2>
            <p className="text-sm text-gray-400">This chat is stateless per request. Last 5 messages saved per question locally.</p>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-red-400"
          >✕</button>
        </div>

        <div className="chat-history flex-1 overflow-y-auto space-y-3 pr-1" onScroll={(e) => {
          const el = e.target;
          const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
          setAutoScroll(atBottom);
        }}>
          {history.map((m, i) => (
            <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
              <div className={`inline-block p-3 rounded-xl whitespace-pre-wrap text-sm ${m.from === 'user' ? 'bg-blue-600' : m.from === 'system' ? 'bg-gray-600 text-xs italic' : 'bg-zinc-800'}`}>
                <ReactMarkdown components={renderers}>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {sending && <div className="text-center mt-2"><LoaderHamster /></div>}
          <div ref={chatEndRef} />
        </div>

        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

        <div className="mt-3 flex gap-2">
          <textarea
            rows={1}
            className="flex-1 p-2 rounded bg-zinc-800 resize-y min-h-[48px] max-h-[3px] text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste code or ask a question…"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 text-sm"
            disabled={sending || !input.trim()}
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={clearChat}
            className="text-xs text-gray-400 hover:underline"
          >Clear Chat</button>
        </div>
      </div>
    </div>
  );
}
