import React from "react";

const WeakKeyPanel = ({ data }) => {
  // SVG Keyboard heatmap mapping
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const getKeyColor = (keyChar) => {
    const stat = data.find((d) => d.key.toLowerCase() === keyChar);
    if (!stat)
      return "bg-[var(--color-surface-2)] text-[var(--color-text)] border-[var(--color-border)]";

    // score mapping based on MD:
    // Green (0.0-0.2), Yellow (0.2-0.5), Orange (0.5-0.7), Red (0.7-1.0)
    if (stat.score < 0.2)
      return "bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]";
    if (stat.score < 0.5)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    if (stat.score < 0.7)
      return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    return "bg-red-500/30 text-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
  };

  return (
    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] p-6 rounded-xl shadow-lg mt-8 lg:mt-0 flex-1 relative flex flex-col justify-center items-center h-full">
      <h3 className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase mb-6 text-center w-full block border-b border-[var(--color-border)] pb-2 absolute top-6">
        Weak Key Heatmap
      </h3>

      {data.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-center py-10 mt-6">
          No weak keys detected yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mt-8 max-w-full">
          {rows.map((row, rIdx) => (
            <div
              key={rIdx}
              className={`flex justify-center gap-1.5 md:gap-2 ${rIdx === 1 ? "ml-4" : rIdx === 2 ? "ml-8" : ""}`}
            >
              {row.map((char) => (
                <div
                  key={char}
                  className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center font-bold text-lg md:text-xl rounded border transition-all ${getKeyColor(char)}`}
                  title={`Key: ${char.toUpperCase()}`}
                >
                  {char.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-accent)]/50"></div>{" "}
              Good
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div> Mild
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500/50"></div> Weak
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>{" "}
              Critical
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeakKeyPanel;
