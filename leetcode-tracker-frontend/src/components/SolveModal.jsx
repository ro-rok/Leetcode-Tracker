export default function SolveModal({ open, question, onClose }) {
  if (!open || !question) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <p className="mb-4">
          Did you solve <strong>“{question.title}”</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={()=>onClose(true)}
            className="px-4 py-2 bg-green-500 rounded text-white"
          >Yes</button>
          <button
            onClick={()=>onClose(false)}
            className="px-4 py-2 bg-red-500 rounded text-white"
          >No</button>
        </div>
      </div>
    </div>
  );
}
