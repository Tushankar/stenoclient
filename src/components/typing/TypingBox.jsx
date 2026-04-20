import React, { useEffect, useRef } from "react";

const TypingBox = ({
  charStates,
  targetText,
  handleKeyPress,
  isStarted,
  wpm,
  accuracy,
  elapsedTime,
  allowBackspace,
  toggleBackspace,
}) => {
  const boxRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling space bar, don't prevent standard keyboard typing
      if (e.key === " " || e.key === "Backspace" || e.key.length === 1) {
        if (e.key === " ") e.preventDefault();
        handleKeyPress(e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      {/* Top Bar / Stats */}
      <div className="flex justify-between items-center bg-[var(--color-surface-2)] p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded bg-[var(--color-bg)] font-bold text-lg text-white">
            ⏱ {elapsedTime}s
          </div>
          <div
            className={`px-3 py-1 rounded font-bold text-lg ${accuracy >= 95 ? "text-[var(--color-accent)]" : accuracy >= 80 ? "text-[var(--color-warning)]" : "text-[var(--color-error)]"}`}
          >
            🎯 {accuracy}%
          </div>
          {typeof allowBackspace === "boolean" && (
            <label className="flex items-center justify-center gap-2 px-3 py-1 ml-4 bg-[var(--color-bg)] rounded text-sm font-bold text-[var(--color-text-muted)] cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition group shrink-0">
              <input
                type="checkbox"
                checked={allowBackspace}
                onChange={(e) => toggleBackspace(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 bg-[var(--color-surface)] cursor-pointer"
              />
              <span className="group-hover:text-white transition">
                Allow Backspace
              </span>
            </label>
          )}
        </div>
        <div className="px-4 py-1 rounded-lg bg-[var(--color-primary)] font-bold text-lg text-white flex items-center shadow shadow-[var(--color-primary-dark)]">
          🚀 {wpm} WPM
        </div>
      </div>

      {/* Timer Progress Bar (Fake example max duration 60s) */}
      <div className="h-1 w-full bg-[var(--color-bg)]">
        <div
          className="h-full bg-[var(--color-primary-light)] transition-all duration-1000 ease-linear"
          style={{ width: `${Math.min((elapsedTime / 60) * 100, 100)}%` }}
        />
      </div>

      {/* Typing Text Area */}
      <div
        ref={boxRef}
        className="p-8 pb-12 text-2xl leading-relaxed tracking-wide typing-font h-64 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-[2px] z-10 rounded-b-xl border-t border-transparent text-xl text-[var(--color-text-muted)] animate-pulse font-mono">
            Type to start practicing...
          </div>
        )}

        {targetText.split("").map((char, index) => {
          const state = charStates[index];
          let colorClass = "text-[var(--color-text-muted)]"; // pending
          if (state === "correct") colorClass = "text-[var(--color-accent)]";
          if (state === "incorrect")
            colorClass =
              "text-[var(--color-error)] underline decoration-red-500/50 bg-red-500/10 rounded-sm";
          if (state === "cursor")
            colorClass = "bg-[var(--color-primary)] text-white animate-pulse";

          return (
            <span
              key={index}
              className={`transition-colors duration-150 ${colorClass}`}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingBox;
