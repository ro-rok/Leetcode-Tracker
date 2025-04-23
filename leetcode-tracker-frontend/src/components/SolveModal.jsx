import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ChatModal from './ChatModal';
import { FaCheck, FaTimes, FaRobot } from 'react-icons/fa';

export default function SolveModal({ open, question, onClose }) {
  const [showAI, setShowAI] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  if (!open || !question) return null;

  const borderColor = {
    yes: 'border-green-600',
    no: 'border-red-600',
    ai: 'border-purple-600',
    default: 'border-gray-700'
  }[hoveredButton || 'default'];

  return (
    <div className="fixed inset-0 z-50 bg-grey/20 backdrop-blur-md flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`bg-black border ${borderColor} hover:shadow-xl rounded-xl p-6 w-full max-w-md shadow-lg text-white transition-colors duration-300`}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">
            Did you solve <span className="text-blue-400">“{question.title}”</span>?
          </h2>

          <div className="flex flex-col space-y-6">
            <div className="flex justify-between gap-4">
              <button
                onClick={() => onClose(true)}
                onMouseEnter={() => setHoveredButton('yes')}
                onMouseLeave={() => setHoveredButton(null)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition font-medium text-sm shadow flex items-center justify-center"
              >
                <FaCheck className="mr-2" />
                Yes, Solved
              </button>
              <button
                onClick={() => onClose(false)}
                onMouseEnter={() => setHoveredButton('no')}
                onMouseLeave={() => setHoveredButton(null)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition font-medium text-sm shadow flex items-center justify-center"
              >
                <FaTimes className="mr-2" />
                No, Not Yet
              </button>
            </div>

            <div className="text-center text-xs text-gray-400 italic">or</div>

            <button
              onClick={() => setShowAI(true)}
              onMouseEnter={() => setHoveredButton('ai')}
              onMouseLeave={() => setHoveredButton(null)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded transition font-semibold text-sm shadow flex items-center justify-center"
            >
              <FaRobot className="mr-2" />
              Ask AI for Help
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md"
          >
            <ChatModal open={true} question={question} onClose={() => setShowAI(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
