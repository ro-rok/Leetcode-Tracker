import { useState, useEffect } from 'react';
import api from '../api';

export default function QuestionList({ questions, onSolve }) {
  const [modal, setModal] = useState(null);

  // show modal when window regains focus
  useEffect(() => {
    const onFocus = () => {
      if (modal && !modal.shown) {
        setModal(m => ({ ...m, shown: true }));
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [modal]);

  const startSolve = q => {
    window.open(q.link, '_blank');
    setModal({ question: q, shown: false });
  };

  const answer = solved => {
    const { question } = modal;
    if (solved) {
      api.post(`/questions/${question.id}/solve.json`).then(() => {
        onSolve(question.id);
      });
    }
    setModal(null);
  };

  return (
    <>
      {questions.map(q => (
        <div
          key={q.id}
          className="mb-3 p-3 border rounded bg-white"
        >
          <a
            href={q.link}
            target="_blank"
            className="font-semibold underline"
          >
            {q.title}
          </a>
          <div className="text-sm">
            {q.difficulty} · freq: {q.frequency} ·
            solved: {q.solved ? '✅' : '❌'}
          </div>
          {!q.solved && (
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => startSolve(q)}
            >
              Solve
            </button>
          )}
        </div>
      ))}

      {modal && modal.shown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4">
              Did you solve “{modal.question.title}”?
            </p>
            <button
              className="mr-2 px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => answer(true)}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => answer(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}
