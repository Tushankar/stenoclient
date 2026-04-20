import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import { Trophy, Medal, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const Leaderboard = () => {
  const { user } = useAuthStore((state) => state);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard?period=${period}`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-500 border border-yellow-500";
      case 2:
        return "bg-gray-300/20 text-gray-300 border border-gray-300";
      case 3:
        return "bg-orange-600/20 text-orange-500 border border-orange-600";
      default:
        return "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]";
    }
  };

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase()),
  );

  const currentUserRank = leaderboard.find(
    (entry) => entry._id === user?.id,
  )?.rank;

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary-light)] flex items-center gap-3">
              <Trophy size={32} /> Global Leaderboard
            </h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Top steno typists tracking their best WPM.
            </p>
          </div>

          {currentUserRank && (
            <div className="bg-[var(--color-surface)] border border-[var(--color-primary)] px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <span className="text-[var(--color-text-muted)] uppercase text-xs font-bold tracking-widest">
                Your Rank
              </span>
              <span className="text-2xl font-black text-[var(--color-primary-light)]">
                #{currentUserRank}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
          {/* Controls */}
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex bg-[var(--color-surface-2)] rounded-lg p-1">
              {["all", "month", "week"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeriod(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition ${
                    period === tab
                      ? "bg-[var(--color-primary)] text-white shadow"
                      : "text-[var(--color-text-muted)] hover:text-white"
                  }`}
                >
                  {tab === "all" ? "All Time" : `This ${tab}`}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] bg-transparent"
                size={18}
              />
              <input
                type="text"
                placeholder="Search competitors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] uppercase text-sm tracking-widest">
                  <th className="px-6 py-4 font-bold">Rank</th>
                  <th className="px-6 py-4 font-bold">Typist</th>
                  <th className="px-6 py-4 font-bold text-center">Top WPM</th>
                  <th className="px-6 py-4 font-bold text-center">Accuracy</th>
                  <th className="px-6 py-4 font-bold text-center">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-[var(--color-text-muted)] animate-pulse"
                    >
                      Loading rankings...
                    </td>
                  </tr>
                ) : filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-[var(--color-text-muted)]"
                    >
                      No results found
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((entry, index) => {
                    const isCurrentUser = entry._id === user?.id;
                    return (
                      <tr
                        key={entry._id}
                        className={`border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-2)]/50 transition ${
                          isCurrentUser ? "bg-indigo-900/20" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankStyle(
                              entry.rank,
                            )}`}
                          >
                            {entry.rank <= 3 ? <Medal size={20} /> : entry.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-dark)] text-white flex items-center justify-center font-bold uppercase border border-[var(--color-primary-light)]">
                              {entry.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                {entry.name}
                                {isCurrentUser && (
                                  <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[var(--color-text-muted)] capitalize">
                                Target: {entry.examTarget || "General"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xl font-black text-white">
                            {entry.bestWPM}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-emerald-400 font-bold">
                            {entry.avgAccuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-[var(--color-text-muted)]">
                          {entry.sessions}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
