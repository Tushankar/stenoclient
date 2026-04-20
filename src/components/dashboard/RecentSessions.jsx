import React from "react";

const RecentSessions = ({ sessions }) => {
  return (
    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl shadow-lg mt-8 overflow-hidden">
      <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <h3 className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase font-bold">
          Recent Sessions
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-bg)]/50 text-[var(--color-text-muted)] text-sm uppercase font-semibold">
            <tr>
              <th className="py-4 px-6 border-b border-[var(--color-border)]">
                Date
              </th>
              <th className="py-4 px-6 border-b border-[var(--color-border)]">
                Mode
              </th>
              <th className="py-4 px-6 border-b border-[var(--color-border)]">
                WPM
              </th>
              <th className="py-4 px-6 border-b border-[var(--color-border)]">
                Accuracy
              </th>
              <th className="py-4 px-6 border-b border-[var(--color-border)] text-right">
                Errors
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-text)] divide-y divide-[var(--color-border)] bg-[var(--color-surface-2)]">
            {sessions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-[var(--color-text-muted)]"
                >
                  No sessions recorded yet.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(s.completedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-6 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${s.mode === "typing" ? "bg-[var(--color-primary)]/20 text-[var(--color-primary-light)]" : "bg-purple-500/20 text-purple-400"}`}
                    >
                      {s.mode}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold">{s.wpm}</td>
                  <td className="py-4 px-6">
                    <span
                      className={
                        s.accuracy >= 95
                          ? "text-[var(--color-accent)]"
                          : s.accuracy >= 80
                            ? "text-[var(--color-warning)]"
                            : "text-[var(--color-error)]"
                      }
                    >
                      {s.accuracy}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-red-400">
                    {s.errorCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSessions;
