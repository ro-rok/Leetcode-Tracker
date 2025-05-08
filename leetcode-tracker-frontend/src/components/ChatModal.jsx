import { useState, useEffect, useRef } from 'react';
import api from '../api';
import LoaderHamster from './LoaderHamster';
import ReactMarkdown from 'react-markdown';
import CodeHighlighter from './CodeHighligter';
import 'highlight.js/styles/atom-one-dark.css';

export default function ChatModal({ open, question, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
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
    
    // Focus the textarea when modal opens
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 100);
    }
  }, [question?.id, open]);

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
        const res = await api.post(
          `/questions/${question.id}/chat.json`,
          { message: userMsg },
          { withCredentials: true } // ✅ This sends cookies
        );
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
        // Focus back on textarea after sending
        textareaRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
        <div className="relative group">
          <button
            className="absolute top-2 right-2 text-xs bg-black/70 opacity-0 group-hover:opacity-100 text-white px-2 py-1 rounded hover:bg-gray-700 transition-opacity z-10"
            onClick={() => navigator.clipboard.writeText(codeText)}
          >
            Copy
          </button>
          <CodeHighlighter code={codeText} language={match[1] || 'javascript'} />
        </div>
      ) : (
        <code className={`px-1 py-0.5 bg-zinc-700 rounded ${className}`} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 text-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-zinc-800">
          <div>
            <h2 className="font-bold text-xl">{question.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Ask the AI assistant about this problem</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Chat history */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-4" 
          onScroll={(e) => {
            const el = e.target;
            const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 10;
            setAutoScroll(atBottom);
          }}
        >
          {history.length === 0 && (
            <div className="text-center text-zinc-500 py-10">
              <p>No messages yet. Start by asking a question.</p>
            </div>
          )}
          
          {history.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl p-3 shadow 
                  ${m.from === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : m.from === 'system' 
                      ? 'bg-zinc-700/70 text-xs italic text-gray-300' 
                      : 'bg-zinc-800 text-gray-100 rounded-tl-none'}`}
              >
                <ReactMarkdown components={renderers}>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          
          {sending && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-2xl p-3 rounded-tl-none shadow animate-pulse">
                <LoaderHamster />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Error message */}
        {error && (
          <div className="px-5 py-2 bg-red-900/30 border-t border-red-800">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Input area */}
        <div className="p-5 border-t border-zinc-800">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              rows={2}
              className="flex-1 p-3 rounded-xl bg-zinc-800 text-sm border border-zinc-700 resize-none min-h-[66px] max-h-[144px] focus:outline-none focus:border-blue-500 transition-colors"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end h-10 flex items-center justify-center"
              disabled={sending || !input.trim()}
            >
              {sending ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
          
          <div className="flex justify-between mt-3 text-xs text-zinc-500">
            <p>Shift+Enter for new line</p>
            <button
              onClick={clearChat}
              className="hover:text-zinc-300 transition-colors"
            >
              Clear conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}