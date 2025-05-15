import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaCheckCircle, FaTimesCircle, FaRobot } from 'react-icons/fa';
import styled from 'styled-components';

// Styled card
const StyledCard = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 15px var(--glowColor);
  transition: box-shadow 0.3s ease;

  &:hover {
    animation: glowPulse 1.5s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 15px var(--glowColor); }
    50% { box-shadow: 0 0 30px var(--glowColor); }
  }
`;

export default function QuestionList({ questions, onSolve, onUnsolve, onChat }) {
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const lastAnimatedIds = useRef('');
  useEffect(() => {
    if (!questions.length || !cardRefs.current.length) return;

    const ids = questions.map(q => q.id).join(',');

    if (ids === lastAnimatedIds.current) {
      return;
    }
    lastAnimatedIds.current = ids;

    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, [questions]);

  const getDifficultyGradient = level => {
    switch (level.toLowerCase()) {
      case 'easy': return 'from-green-600/30';
      case 'medium': return 'from-yellow-600/30';
      case 'hard': return 'from-red-600/30';
      default: return 'from-gray-600/30';
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="col-span-full text-center mt-6 text-gray-400 text-sm">
        <p className="mb-2">🚫 <span className="font-semibold">No questions available for this filter or company.</span></p>
        <p className="mb-1">Try using the <span className="text-yellow-400 font-medium">Populate</span> button, or switch tabs/timeframes.</p>
        <p className="mb-1">If populating, it may take a few seconds to load. Please be patient or click the <span className="text-blue-400 font-medium">Refresh</span> button.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {questions.map((q, i) => {
        const borderColor = q.solved ? '#4ade80' : '#f87171';
        const glowColor = q.solved ? '#22c55e88' : '#ef444488';

        return (
          <StyledCard
            key={q.id}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            style={{ '--borderColor': borderColor, '--glowColor': glowColor }}
            className={`question-card bg-gradient-to-br ${getDifficultyGradient(q.difficulty)} to-black/40 backdrop-blur-md transition-transform transform hover:scale-[1.05]`}
          >
            <div className="absolute top-0 right-0 px-2 py-1 rounded-bl-xl bg-black/30 text-xs font-semibold text-white/80">
              {q.difficulty.toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 px-2 py-1 rounded-tl-xl bg-black/30 text-xs font-semibold text-white/80">
              {q.solved
                ? <><FaCheckCircle className="inline text-green-400" /> Solved</>
                : <><FaTimesCircle className="inline text-red-400" /> Unsolved</>}
            </div>
            <div className="relative z-10 p-4 space-y-3">
              <a
                href={q.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-purple-300 hover:underline block"
              >
                {q.title}
              </a>
              <div className="text-sm text-gray-300">
                <div className="mb-1">
                  <span className="font-semibold text-yellow-400">Frequency:</span> {q.frequency}
                </div>
                <div>
                  <span className="font-semibold text-blue-300">Topics:</span> {q.topics}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {q.solved ? (
                  <button
                    onClick={() => onUnsolve(q.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white transition-shadow shadow-md"
                  >
                    <FaTimesCircle /> Unsolve
                  </button>
                ) : (
                  <button
                    onClick={() => onSolve(q)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white transition-shadow shadow-md"
                  >
                    <FaCheckCircle /> Solve
                  </button>
                )}
                <button
                  onClick={() => onChat(q)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-md text-sm text-white transition-shadow shadow-md"
                >
                  <FaRobot /> Ask AI
                </button>
              </div>
            </div>
          </StyledCard>
        );
      })}
      <div className="col-span-full text-center mt-8 text-sm text-gray-500">
        🎉 <span className="italic">You’ve reached the end of the question list.</span>
      </div>
    </div>
  );
}
