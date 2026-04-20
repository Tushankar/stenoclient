import { Link } from "react-router-dom";
import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
} from "recharts";
import AIFeedbackPanel from "../ai/AIFeedbackPanel";

const ResultsScreen = ({ session }) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { wpm, accuracy, duration, errors, weakKeysDetected } = session;

  const data = [
    { name: "Accuracy", value: accuracy, fill: "var(--color-accent)" },
  ];

  const errTypes = {
    substitution: errors.filter((e) => e.type === "substitution").length,
    transposition: errors.filter((e) => e.type === "transposition").length,
    omission: errors.filter((e) => e.type === "omission").length,
    insertion: errors.filter((e) => e.type === "insertion").length,
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[var(--color-bg)] min-h-[calc(100vh-80px)]">
      <div className="bg-[var(--color-surface)] shadow-2xl rounded-2xl border border-[var(--color-border)] p-12 max-w-4xl w-full">
        <h2 className="text-4xl font-black text-center mb-10 text-[var(--color-primary-light)]">
          Session Complete
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* WPM Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-primary)]">
            <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest mb-2">
              Speed
            </span>
            <div className="text-6xl font-extrabold text-white animate-bounce">
              {wpm}{" "}
              <span className="text-2xl text-[var(--color-primary-light)]">
                WPM
              </span>
            </div>
            <span className="mt-4 px-3 py-1 bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded text-sm">
              Time: {Math.round(duration)}s
            </span>
          </div>

          {/* Accuracy Radial Chart */}
          <div className="flex flex-col items-center justify-center p-6 bg-[var(--color-surface-2)] rounded-xl relative">
            <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest mb-2">
              Accuracy
            </span>
            <div className="h-40 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={16}
                  data={data}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute text-3xl font-bold text-white">
                {accuracy}%
              </div>
            </div>
          </div>

          {/* Error Breakdown */}
          <div className="flex flex-col justify-center p-6 bg-[var(--color-surface-2)] rounded-xl text-sm">
            <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest mb-4 border-b border-[var(--color-border)] pb-2">
              Error Types
            </span>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-red-400">Substitution:</span>{" "}
                <span>{errTypes.substitution}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-orange-400">Transposition:</span>{" "}
                <span>{errTypes.transposition}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-yellow-400">Omission:</span>{" "}
                <span>{errTypes.omission}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-blue-400">Insertion:</span>{" "}
                <span>{errTypes.insertion}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Weak Keys */}
        {weakKeysDetected && weakKeysDetected.length > 0 && (
          <div className="mb-10 text-center">
            <span className="text-[var(--color-text-muted)] uppercase tracking-widest mb-4 inline-block">
              Weak Keys Detected
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {weakKeysDetected.map((k) => (
                <span
                  key={k}
                  className="w-12 h-12 flex items-center justify-center bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)] rounded-lg font-bold text-xl uppercase shadow shadow-[var(--color-error)]/20"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6 mt-8 p-6 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
          <Link
            to="/practice"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg hover:bg-[var(--color-primary-dark)] transition-transform hover:scale-105 font-bold"
          >
            Practice Again
          </Link>
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-lg text-lg hover:bg-[var(--color-border)] transition border border-[var(--color-border)]"
          >
            See AI Analysis
          </button>
          <Link
            to="/dashboard"
            className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-lg text-lg hover:bg-[var(--color-border)] transition border border-[var(--color-border)]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <AIFeedbackPanel
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        session={session}
      />
    </div>
  );
};

export default ResultsScreen;
