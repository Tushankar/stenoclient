import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { RotateCcw, AlertTriangle } from "lucide-react";
import TypingBox from "../components/typing/TypingBox";
import { useTypingEngine } from "../hooks/useTypingEngine";

const ErrorDrill = () => {
  const [loading, setLoading] = useState(true);
  const [drillText, setDrillText] = useState("");

  useEffect(() => {
    generateDrills();
  }, []);

  const generateDrills = async () => {
    setLoading(true);
    try {
      const res = await api.get("/analysis/weak-keys");
      const weakData = res.data?.heatmapData || [];
      const topWeak = weakData.slice(0, 5).map((k) => k.key);

      if (topWeak.length === 0) topWeak.push("t", "h", "e");

      const words = [];
      const dictionary = [
        "there",
        "respect",
        "string",
        "therefore",
        "rest",
        "stream",
        "thing",
        "think",
        "strong",
        "through",
      ];
      for (let i = 0; i < 30; i++) {
        // Pick words containing weak patterns (approximate mock for phase 6 frontend functionality)
        words.push(dictionary[Math.floor(Math.random() * dictionary.length)]);
      }
      setDrillText(words.join(" "));
    } catch (err) {
      console.log("Error loading drills");
    } finally {
      setLoading(false);
    }
  };

  const {
    chars,
    charStates,
    isStarted,
    isFinished,
    handleKeyPress,
    accuracy,
    wpm,
    elapsedSeconds,
    reset,
  } = useTypingEngine(drillText);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-red-500 animate-pulse font-bold text-2xl">
        Loading Drill Matrix...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col p-8 items-center bg-[var(--color-bg)]">
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-3xl font-black text-red-500 mb-2 flex items-center justify-center gap-3">
          <AlertTriangle size={32} /> Error Isolation Drill
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          These words target your weakest muscle memory links. Repeat them to
          rebuild correct paths.
        </p>
      </div>

      <div className="w-full relative max-w-4xl">
        <TypingBox
          charStates={charStates}
          targetText={drillText}
          handleKeyPress={handleKeyPress}
          isStarted={isStarted}
          wpm={wpm}
          accuracy={accuracy}
          elapsedTime={elapsedSeconds}
        />

        {!isStarted && !isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/20 backdrop-blur-[2px] z-10 rounded-xl pointer-events-none">
            <span className="text-xl font-bold bg-red-500/10 text-red-500 px-6 py-2 border border-red-500/50 rounded-full shadow-2xl animate-bounce">
              Strike any key to start drill
            </span>
          </div>
        )}
      </div>

      {isFinished && (
        <div className="mt-8 flex flex-col items-center gap-4 slide-up">
          <div className="text-2xl font-black text-emerald-400">
            Drill Completed!
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                reset();
                generateDrills();
              }}
              className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-lg text-lg hover:border-red-400 transition border border-[var(--color-border)] shadow"
            >
              <RotateCcw className="inline mr-2" /> Next Drill Round
            </button>
            <Link
              to="/training"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-500 transition font-bold"
            >
              Exit to Training
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDrill;
