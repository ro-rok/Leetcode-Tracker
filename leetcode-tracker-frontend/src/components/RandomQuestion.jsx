import { FaCheckCircle, FaTimesCircle, FaRobot } from 'react-icons/fa';

export default function RandomQuestionCard({ question, onSolve, onUnsolve, onChat }) {
  if (!question) return null;

  const solved = question.solved;
  const borderColor = solved ? 'border-green-500' : 'border-red-500';
  const glowColor = solved ? 'shadow-green-500/30' : 'shadow-red-500/30';

  return (
    <div
      className={`mb-5 relative rounded-xl p-5 bg-gradient-to-br from-gray-800 to-black/70 border-2 ${borderColor} shadow-lg ${glowColor} transition-transform transform hover:scale-[1.02] animate-fade-in `}
    >
      {/* Top-left difficulty badge */}
      <div className="absolute top-0 left-0 px-3 py-1 text-xs font-semibold text-white bg-black/40 rounded-br-xl">
        {question.difficulty.toUpperCase()}
      </div>

      {/* Title */}
      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-bold text-yellow-300 hover:underline block mb-2"
      >
        {question.title}
      </a>

      {/* Frequency & Topics */}
      <div className="text-sm text-gray-300 space-y-1">
        <div><span className="font-semibold text-yellow-400">Frequency:</span> {question.frequency}</div>
        <div><span className="font-semibold text-blue-300">Topics:</span> {question.topics}</div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {solved ? (
          <button
            onClick={() => onUnsolve()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded-md text-white shadow"
          >
            <FaTimesCircle /> Unsolve
          </button>
        ) : (
          <button
            onClick={() => onSolve(question)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-md text-white shadow"
          >
            <FaCheckCircle /> Solve
          </button>
        )}

        <button
          onClick={() => onChat(question)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 text-sm rounded-md text-white shadow"
        >
          <FaRobot /> Ask AI
        </button>
      </div>
    </div>
  );
}
