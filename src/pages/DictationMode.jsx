import React, { useState, useEffect } from "react";
import { Play, Pause, Square, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useDictation } from "../hooks/useDictation";
import { useTypingEngine } from "../hooks/useTypingEngine";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultsScreen from "../components/typing/ResultsScreen";

const speeds = [60, 80, 100, 120, 140];

const DictationMode = () => {
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wpmSpeed, setWpmSpeed] = useState(100);
  const [hideText, setHideText] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(null);

  const targetText = passage?.content || "";

  const {
    isPlaying,
    isPaused,
    isFinished: audioFinished,
    play,
    pause,
    stop,
    replay,
  } = useDictation(targetText, wpmSpeed, passage?.language);

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
    fetchRandomPassage();
    return () => stop(); // Stop audio on unmount
  }, [stop]);

  const fetchRandomPassage = async () => {
    setLoading(true);
    try {
      const res = await api.get("/texts/random?examType=SSC");
      if (res.data.success && res.data.text) {
        setPassage(res.data.text);
      }
    } catch (err) {
      toast.error("Failed to load text passage.");
    } finally {
      setLoading(false);
    }
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

  if (sessionSaved) {
    return <ResultsScreen session={sessionSaved} />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 flex flex-col items-center select-none">
      <div className="w-full max-w-4xl border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 mb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-primary-light)]">
              🎧 Dictation Mode
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Exam:{" "}
              <span className="font-bold">
                {passage?.examType || "General"}
              </span>{" "}
              | Difficulty:{" "}
              <span className="capitalize font-bold">
                {passage?.difficulty || "unknown"}
              </span>
            </p>
          </div>
          <button
            onClick={() => setHideText(!hideText)}
            className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition"
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

        {/* Source Text Area (Hideable) */}
        <div
          className={`p-6 border rounded-xl overflow-y-auto mb-6 h-40 font-mono text-lg leading-relaxed transition-all ${
            hideText
              ? "bg-[var(--color-bg)] border-[var(--color-border)] blur-[8px] opacity-30 select-none"
              : "bg-[var(--color-surface-2)] border-[var(--color-primary)]/30 text-[var(--color-text)]"
          }`}
        >
          {targetText}
        </div>

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

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              stop();
              reset();
            }}
            className="px-6 py-2 rounded-lg text-sm font-bold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)]"
          >
            Start Over
          </button>
          <button
            onClick={handleFinish}
            className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-lg shadow-lg font-bold hover:bg-[var(--color-primary-dark)]"
          >
            Finish Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictationMode;
