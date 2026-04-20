import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Library,
} from "lucide-react";
import { useDictation } from "../hooks/useDictation";
import { useTypingEngine } from "../hooks/useTypingEngine";
import PassageBrowser from "../components/PassageBrowser";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultsScreen from "../components/typing/ResultsScreen";

const speeds = [60, 80, 100, 120, 140];
const difficulties = ["easy", "medium", "hard"];

const DictationMode = () => {
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wpmSpeed, setWpmSpeed] = useState(100);
  const [hideText, setHideText] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  const targetText = passage?.content || "";

  const {
    isPlaying,
    isPaused,
    isFinished: audioFinished,
    play,
    pause,
    stop,
    replay,
  } = useDictation(targetText, wpmSpeed, passage?.language || "english");

  const {
    typedText,
    wpm,
    accuracy,
    isStarted,
    isFinished: typingFinished,
    handleKeyPress,
    reset,
    keystrokeData,
    elapsedSeconds,
  } = useTypingEngine(targetText);

  useEffect(() => {
    if (!showDifficultySelector && difficulty) {
      fetchRandomPassage();
    }
    return () => stop(); // Stop audio on unmount
  }, [stop, showDifficultySelector, difficulty]);

  const fetchRandomPassage = async () => {
    setLoading(true);
    try {
      const difficultyMap = {
        easy: "beginner",
        medium: "intermediate",
        hard: "advanced",
      };

      const res = await api.get(
        "/texts/random?examType=SSC&difficulty=" + difficultyMap[difficulty],
      );
      if (res.data.success && res.data.text) {
        setPassage(res.data.text);
        // Reset typing state for new passage
        reset();
        stop();
        // Auto-hide text for hard difficulty
        setHideText(difficulty === "hard");
      } else {
        toast.error("No passages available for this difficulty.");
      }
    } catch (err) {
      toast.error("Failed to load text passage.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassage = async () => {
    await fetchRandomPassage();
    toast.success("New passage loaded!");
  };

  const handleGenerateAIPassage = async () => {
    setAiGenerating(true);
    try {
      const res = await api.post("/texts/generate-ai", {
        difficulty,
        examType: "SSC",
        wordCount:
          difficulty === "easy" ? 80 : difficulty === "medium" ? 150 : 250,
        topics: "general education",
      });

      if (res.data.success && res.data.text) {
        setPassage(res.data.text);
        reset();
        stop();
        setHideText(difficulty === "hard");
        toast.success("✨ AI passage generated! Ready for dictation.");
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate AI passage",
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSelectPassage = (selectedPassage) => {
    setPassage(selectedPassage);
    reset();
    stop();
    setShowBrowser(false);
    setShowDifficultySelector(false);
    // Auto-hide text for hard difficulty if applicable
    if (selectedPassage.difficulty === "advanced") {
      setHideText(true);
    }
    toast.success(`Selected: ${selectedPassage.title}`);
  };

  const handleFinish = async () => {
    stop();
    try {
      const payload = {
        passageId: passage?._id,
        expectedText: targetText,
        typedText: typedText,
        keystrokeData: keystrokeData,
        duration: Math.max(elapsedSeconds, 1),
        mode: "dictation",
      };

      const res = await api.post("/sessions", payload);
      if (res.data.success) {
        setSessionSaved(res.data.session);
        toast.success("Dictation session saved!");
      }
    } catch (err) {
      toast.error("Failed to save session.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid interference with controls, but capture typing
      if (
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "BUTTON"
      ) {
        if (e.key.length === 1 || e.key === "Backspace") {
          if (e.key === " ") e.preventDefault();
          handleKeyPress(e.key);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  if (loading && !passage) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-2xl animate-pulse text-[var(--color-primary-light)]">
        Loading passage...
      </div>
    );
  }

  if (showDifficultySelector) {
    return (
      <div className="min-h-[calc(100vh-80px)] p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-black text-center mb-8 text-[var(--color-primary-light)]">
            🎧 Select Difficulty Level
          </h2>

          <div className="space-y-4">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  setShowDifficultySelector(false);
                }}
                className="w-full p-6 border-2 border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-2)] transition-all group"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="text-xl font-bold capitalize text-white group-hover:text-[var(--color-primary-light)]">
                      {diff === "easy" && "🟢 Easy"}
                      {diff === "medium" && "🟡 Medium"}
                      {diff === "hard" && "🔴 Hard"}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      {diff === "easy" &&
                        "Show text, slower speed - Perfect for beginners"}
                      {diff === "medium" &&
                        "Show text, normal speed - Good practice"}
                      {diff === "hard" &&
                        "No text visible, fast speed - Challenge yourself!"}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-[var(--color-primary-light)]">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 mt-8">
            <h3 className="text-lg font-bold text-center mb-4 text-[var(--color-primary-light)]">
              📚 Browse Existing Passages
            </h3>
            <button
              onClick={() => {
                setShowBrowser(true);
                setShowDifficultySelector(false);
              }}
              className="w-full p-3 bg-[var(--color-surface-2)] text-white rounded-lg font-bold hover:bg-[var(--color-primary)]/20 transition flex items-center justify-center gap-2 border border-[var(--color-border)]"
            >
              <Library size={20} /> Browse All Passages
            </button>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 mt-8">
            <h3 className="text-lg font-bold text-center mb-4 text-[var(--color-primary-light)]">
              ✨ Or Generate with AI
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] text-center mb-4">
              Let AI create a custom passage focused on your weak areas
            </p>
            <div className="space-y-3">
              {difficulties.map((diff) => (
                <button
                  key={`ai-${diff}`}
                  onClick={() => {
                    setDifficulty(diff);
                    handleGenerateAIPassage();
                    setShowDifficultySelector(false);
                  }}
                  disabled={aiGenerating}
                  className="w-full p-3 bg-gradient-to-r from-[var(--color-primary)]/70 to-[var(--color-accent)]/70 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 capitalize"
                >
                  {aiGenerating ? (
                    <>
                      <span className="animate-spin">⚙️</span> Generating {diff}
                      ...
                    </>
                  ) : (
                    <>
                      ✨ AI {diff === "easy" && "🟢"}
                      {diff === "medium" && "🟡"}
                      {diff === "hard" && "🔴"}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionSaved) {
    return <ResultsScreen session={sessionSaved} />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 flex flex-col items-center select-none">
      <div className="w-full max-w-4xl border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 mb-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-primary-light)]">
              🎧 Dictation Mode
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Level:{" "}
              <span className="capitalize font-bold">
                {difficulty === "easy" && "🟢 Easy"}
                {difficulty === "medium" && "🟡 Medium"}
                {difficulty === "hard" && "🔴 Hard"}
              </span>{" "}
              | Exam:{" "}
              <span className="font-bold">
                {passage?.examType || "General"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBrowser(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition disabled:opacity-50"
              title="Browse and select passages"
            >
              <Library size={16} /> Browse
            </button>
            <button
              onClick={handleChangePassage}
              disabled={loading}
              className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition disabled:opacity-50"
            >
              <RefreshCw size={16} /> Change Passage
            </button>
            <button
              onClick={() => setHideText(!hideText)}
              disabled={difficulty === "hard"}
              className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition disabled:opacity-50"
            >
              {hideText ? (
                <>
                  <Eye size={16} /> Show Text
                </>
              ) : (
                <>
                  <EyeOff size={16} /> Hide Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-4 mb-6 bg-[var(--color-bg)] p-2 rounded-xl">
            <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest pl-2">
              Speed:
            </span>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setWpmSpeed(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${wpmSpeed === s ? "bg-[var(--color-primary)] text-white shadow" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            {!isPlaying ? (
              <button
                onClick={play}
                className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <Play fill="currentColor" /> Play
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <Pause fill="currentColor" /> Pause
              </button>
            )}
            <button
              onClick={stop}
              disabled={!isPlaying && !isPaused}
              className="flex items-center gap-2 bg-[var(--color-surface-2)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-border)] transition"
            >
              <Square fill="currentColor" /> Stop
            </button>
            <button
              onClick={replay}
              className="flex items-center gap-2 bg-[var(--color-surface-2)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-border)] transition"
            >
              <RotateCcw /> Replay
            </button>
          </div>

          {/* Waveform Visualization */}
          {isPlaying && (
            <div className="flex gap-1 h-8 mt-6 items-end justify-center">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[var(--color-primary-light)] rounded-t-sm"
                  style={{
                    height: `${Math.max(10, Math.random() * 100)}%`,
                    animation: `pulse ${0.5 + Math.random() * 0.5}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Source Text Area (Hideable) - Always hidden in hard mode */}
        {difficulty !== "hard" && (
          <div
            className={`p-6 border rounded-xl overflow-y-auto mb-6 h-40 font-mono text-lg leading-relaxed transition-all ${
              hideText
                ? "bg-[var(--color-bg)] border-[var(--color-border)] blur-[8px] opacity-30 select-none"
                : "bg-[var(--color-surface-2)] border-[var(--color-primary)]/30 text-[var(--color-text)]"
            }`}
          >
            {targetText}
          </div>
        )}

        {difficulty === "hard" && !isStarted && (
          <div className="p-6 border rounded-xl bg-[var(--color-bg)] border-[var(--color-primary)]/30 mb-6 h-40 flex items-center justify-center">
            <p className="text-center text-[var(--color-text-muted)] font-bold">
              🔒 Hard Mode: Text is hidden
              <br />
              <span className="text-sm">
                Focus on listening and typing what you hear
              </span>
            </p>
          </div>
        )}

        {/* Typing Box specifically for dictation */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[var(--color-text-muted)] text-sm font-bold uppercase">
              Type what you hear:
            </span>
            <div className="flex gap-4 text-xs font-mono text-[var(--color-text-muted)]">
              <span>
                WPM: <b className="text-[var(--color-primary-light)]">{wpm}</b>
              </span>
              <span>
                Acc:{" "}
                <b
                  className={
                    accuracy >= 90
                      ? "text-[var(--color-accent)]"
                      : "text-yellow-500"
                  }
                >
                  {accuracy}%
                </b>
              </span>
            </div>
          </div>

          <div className="w-full h-40 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-colors font-mono text-xl overflow-y-auto break-words">
            {!isStarted && (
              <span className="text-[var(--color-text-muted)] opacity-50 absolute mt-1 ml-1">
                Begin typing...
              </span>
            )}
            <span className="text-white">{typedText}</span>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={() => {
              stop();
              reset();
            }}
            className="px-6 py-2 rounded-lg text-sm font-bold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition"
          >
            Start Over
          </button>
          <button
            onClick={() => {
              setShowDifficultySelector(true);
              stop();
              reset();
            }}
            className="px-6 py-2 rounded-lg text-sm font-bold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition"
          >
            Change Difficulty
          </button>
          <button
            onClick={handleFinish}
            className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-lg shadow-lg font-bold hover:bg-[var(--color-primary-dark)] transition"
          >
            Finish Exam
          </button>
        </div>
      </div>

      {showBrowser && (
        <PassageBrowser
          onSelectPassage={handleSelectPassage}
          onClose={() => setShowBrowser(false)}
          mode="dictation"
        />
      )}
    </div>
  );
};

export default DictationMode;
