import React, { useEffect, useRef } from 'react';
import { FaBolt, FaRobot, FaCheck } from 'react-icons/fa';
import gsap from 'gsap';

export default function Homepage() {
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(logoRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.4 });
    gsap.fromTo(cardsRef.current, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.8,
      delay: 0.8,
      ease: 'power2.out'
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-150 sm:py-12 text-white">
      <img
        ref={logoRef}
        src="/logo-bg.webp"
        alt="GrindMate.AI Logo"
        className="w-40 sm:w-60 mb-6 sm:mb-4 animate-pulse drop-shadow-xl"
      />

      <h1 ref={titleRef} className="text-4xl font-bold mb-4">
        Welcome to <span className="text-blue-400">GrindMate.AI</span>
      </h1>

      <p className="max-w-2xl text-lg text-gray-300 mb-8">
        Your ultimate AI-powered coding prep assistant. Practice curated LeetCode questions by company and timeframe,
        track your progress, and get instant AI help on any problem you face.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
        {[
          {
            icon: <FaBolt className="text-yellow-400 text-3xl mb-3 mx-auto" />,
            title: 'Filter & Focus',
            text: 'Pick companies and timeframes to get the most relevant problems instantly.'
          },
          {
            icon: <FaCheck className="text-green-400 text-3xl mb-3 mx-auto" />,
            title: 'Track Progress',
            text: 'Mark problems as solved and revisit unsolved ones any time.'
          },
          {
            icon: <FaRobot className="text-orange-400 text-3xl mb-3 mx-auto" />,
            title: 'AI-Powered Assistance',
            text: 'Confused? Ask AI directly inside the app for code reviews and hints.'
          }
        ].map((card, i) => (
          <div
            key={i}
            ref={el => cardsRef.current[i] = el}
            className="p-5 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700"
          >
            {card.icon}
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-400">{card.text}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 pb-5">
        Start by selecting a company from the sidebar. If none are listed, use the <strong>Populate</strong> button to import question data.
      </p>
      <footer className="text-xs text-gray-600 mt-10">
        © Rohan Khanna {new Date().getFullYear()}
      </footer>
    </div>
  );
}
