import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HomeDashboard – Premium gamified dashboard for Code for Tomorrow.
 *
 * Layout uses a responsive Tailwind grid. All cards have a glass‑morphic
 * background (`bg-slate-900/50 backdrop-blur-md border border-slate-800`).
 * Images point to local `/assets/...` paths to work offline on a Raspberry Pi.
 *
 * Data‑attributes (`data-agent-track`, `data-sync-metric`) are preserved on the
 * interactive elements that need telemetry.
 */
export default function HomeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-radial from-indigo-900 via-slate-900 to-black p-6">
      {/* Top navigation bar with telemetry badge */}
      <nav className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Code for Tomorrow</h1>
        <span
          className="px-3 py-1 text-sm font-medium text-green-200 bg-green-900/60 rounded-full animate-pulse"
          data-agent-track="online-badge"
        >
          Online
        </span>
      </nav>

      {/* Main grid – 3 columns on lg, 1 column on smaller screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-min">
        {/* Left primary column – spans 2 columns on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Brain Training card */}
          <section
            className="bg-slate-800/60 backdrop-blur-md backdrop-saturate-150 border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="brain-training-card"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Brain Training</h2>
            <p className="text-gray-300">
              Strengthen logical thinking with puzzles and coding challenges.
            </p>
            <Link
              to="/brain-training"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              Start Training →
            </Link>
          </section>

          {/* Suggested Courses – fills the gap below Brain Training */}
          <section
            className="bg-slate-800/60 backdrop-blur-md backdrop-saturate-150 border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="suggested-courses"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Suggested Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Moroccan Coding Adventures */}
              <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                <img
                  src="/assets/moroccan-coding-adventure.png"
                  alt="Moroccan Coding Adventures"
                  className="mx-auto mb-2 w-16 h-16 object-contain"
                />
                <h3 className="text-sm font-medium text-white">Moroccan Coding Adventures</h3>
              </div>
              {/* Python Track */}
              <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                <img
                  src="/assets/python-track.png"
                  alt="Python Track"
                  className="mx-auto mb-2 w-16 h-16 object-contain"
                />
                <h3 className="text-sm font-medium text-white">Python</h3>
              </div>
              {/* Web Dev Track */}
              <div className="bg-slate-800/30 rounded-lg p-4 text-center">
                <img
                  src="/assets/webdev-track.png"
                  alt="Web Development Track"
                  className="mx-auto mb-2 w-16 h-16 object-contain"
                />
                <h3 className="text-sm font-medium text-white">Web Development</h3>
              </div>
            </div>
          </section>

          {/* Live Sessions Card */}
          <section
            className="bg-slate-800/60 backdrop-blur-md backdrop-saturate-150 border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="live-sessions-card"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Live Sessions</h2>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/live-sessions.png"
                alt="Live Sessions"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-300">Join live coding workshops and Q&A.</p>
            </div>
            <Link
              to="/live-sessions"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              Join Now →
            </Link>
          </section>

          {/* Challenges Card */}
          <section
            className="bg-slate-800/60 backdrop-blur-md backdrop-saturate-150 border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="challenges-card"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Challenges</h2>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/challenges.png"
                alt="Challenges"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-300">Complete weekly coding challenges to earn badges.</p>
            </div>
            <Link
              to="/challenges"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              View Challenges →
            </Link>
          </section>

          {/* Workouts Card */}
          <section
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="workouts-card"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Workouts</h2>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/workouts.png"
                alt="Workouts"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-300">Daily coding drills to sharpen your skills.</p>
            </div>
            <Link
              to="/workouts"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              Start Workout →
            </Link>
          </section>

          {/* Play MentalUP Card */}
          <section
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:scale-105 transition-transform"
            data-agent-track="play-mentalup-card"
            data-sync-metric="mentalup-engagement"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Play MentalUP</h2>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/mentalup.png"
                alt="MentalUP"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-300">Boost cognition with fun brain games.</p>
            </div>
            <Link
              to="/mentalup"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              Play Now →
            </Link>
          </section>

          {/* Resume Study Card */}
          <section
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6"
            data-agent-track="resume-study-card"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Resume Study</h2>
            <div className="flex items-center space-x-4">
              <img
                src="/assets/resume-study.png"
                alt="Resume Study"
                className="w-16 h-16 object-contain"
              />
              <p className="text-gray-300">Pick up where you left off.</p>
            </div>
            <Link
              to="/resume"
              className="mt-4 inline-block text-indigo-300 hover:text-indigo-100 transition-all duration-300 ease-in-out"
            >
              Continue →
            </Link>
          </section>
        </div>

        {/* Right sidebar – navigation & daily missions */}
        <aside className="space-y-6">
          {/* Sidebar navigation links */}
          <nav className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-4">
            <ul className="flex flex-col space-y-2">
              {[
                { name: 'Home', to: '/' },
                { name: 'Learn Code', to: '/learn' },
                { name: 'AI Assistant', to: '/ai' },
                { name: 'Missions', to: '/missions' },
                { name: 'Profile', to: '/profile' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in-out"
                    data-agent-track={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Daily Missions – Moroccan Treasure Chest */}
          <section
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex items-center space-x-4"
            data-agent-track="daily-mission-chest"
          >
            <div className="text-4xl" aria-hidden="true">
              {/* Chest emoji with hover tilt & shake */}
              <span className="inline-block transform transition-transform duration-300 ease-in-out hover:rotate-6 hover:animate-shake">
                🎁
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Moroccan Treasure Chest</h3>
              <p className="text-sm text-gray-400">Complete today’s mission to unlock a surprise!</p>
              <button
                className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-all duration-300"
                data-agent-track="open-chest-btn"
              >
                Open Chest
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/*
  Custom keyframe for shake animation – add to Tailwind config (tailwind.config.js):
  module.exports = {
    theme: {
      extend: {
        keyframes: {
          shake: {
            '0%, 100%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-2px)' },
            '75%': { transform: 'translateX(2px)' },
          },
        },
        animation: {
          shake: 'shake 0.5s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  };
*/
