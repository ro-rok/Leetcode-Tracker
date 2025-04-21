export default function QuestionList({ questions, onSolve, onUnsolve }) {
  return (
    <div className="space-y-3">
      {questions.length === 0
        ? <div className="text-center mt-6">No questions available</div>
        : questions.map(q => (
          <div key={q.id} className="p-3 border rounded bg-gray-800">
            <a href={q.link} target="_blank" className="font-semibold underline">
              {q.title}
            </a>
            <div className="text-sm mt-1">
              {q.difficulty} · freq: {q.frequency} · solved: {q.solved ? '✅' : '❌'} · topics: {q.topics}
            </div>
            {q.solved ? (
              <button
                className="mt-2 px-3 py-1 bg-red-600 rounded"
                onClick={()=>onUnsolve(q.id)}
              >
                Unsolve
              </button>
            ) : (
              <button
                className="mt-2 px-3 py-1 bg-blue-600 rounded"
                onClick={()=>onSolve(q)}
              >
                Solve
              </button>
            )}
          </div>
      ))}
    </div>
  )
}
