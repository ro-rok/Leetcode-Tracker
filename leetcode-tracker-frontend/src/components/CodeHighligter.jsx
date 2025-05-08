import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function CodeHighlighter({ code, language }) {
  const codeRef = useRef(null);
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);
  
  return (
    <div className="relative rounded-md overflow-hidden">
      <pre className="p-4 bg-zinc-900 overflow-x-auto">
        <code ref={codeRef} className={language ? `language-${language}` : ''}>
          {code}
        </code>
      </pre>
    </div>
  );
}