// src/components/SolveModal.jsx
import React from 'react';

export default function SolveModal({ open, question, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl max-w-sm">
        <h3 className="mb-4">
          Did you solve “<strong>{question.title}</strong>”?
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => onClose(true)}
            className="flex-1 p-2 bg-green-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => onClose(false)}
            className="flex-1 p-2 bg-red-500 text-white rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
