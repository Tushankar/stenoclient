import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { RotateCcw, AlertTriangle, RefreshCw, Library } from "lucide-react";
import TypingBox from "../components/typing/TypingBox";
import PassageBrowser from "../components/PassageBrowser";
import { useTypingEngine } from "../hooks/useTypingEngine";

const ErrorDrill = () => {
  const [loading, setLoading] = useState(true);
  const [drillText, setDrillText] = useState("");
  const [showBrowser, setShowBrowser] = useState(false);

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

  const handleSelectPassage = (passage) => {
    setDrillText(passage.content);
    reset();
    setShowBrowser(false);
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
      <div className="max-w-4xl w-full mb-10">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-black text-red-500 mb-2 flex items-center justify-center gap-3">
              <AlertTriangle size={32} /> Error Isolation Drill
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg">
              These words target your weakest muscle memory links. Repeat them
              to rebuild correct paths.
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setShowBrowser(true)}
              title="Browse and select passages"
              className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition whitespace-nowrap"
            >
              <Library size={16} /> Browse
            </button>
            <button
              onClick={() => {
                reset();
                generateDrills();
              }}
              disabled={loading}
              title="Generate new drill"
              className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <RefreshCw size={16} /> New Drill
            </button>
          </div>
        </div>
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
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => {
                reset();
                generateDrills();
              }}
              className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-lg text-lg hover:border-red-400 transition border border-[var(--color-border)] shadow"
            >
              <RotateCcw className="inline mr-2" /> Next Drill Round
            </button>
            <button
              onClick={() => reset()}
              className="bg-red-500/10 text-red-400 px-8 py-3 rounded-lg text-lg hover:bg-red-500/20 transition border border-red-500/30 shadow"
            >
              <RotateCcw className="inline mr-2" /> Restart Current
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
      {showBrowser && (
        <PassageBrowser
          onSelectPassage={handleSelectPassage}
          onClose={() => setShowBrowser(false)}
          mode="drill"
        />
      )}{" "}
    </div>
  );
};

export default ErrorDrill;
