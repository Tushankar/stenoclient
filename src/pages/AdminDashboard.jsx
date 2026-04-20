import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Users, Activity, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New passage state
  const [passageTitle, setPassageTitle] = useState("");
  const [passageContent, setPassageContent] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassage = async (e) => {
    e.preventDefault();
    if (!passageTitle || !passageContent) return;
    try {
      const res = await api.post("/admin/passage", {
        title: passageTitle,
        content: passageContent,
        difficulty: "intermediate",
        examType: "SSC",
        language: "english",
      });
      if (res.data.success) {
        setStatusMessage("Passage successfully created!");
        setPassageTitle("");
        setPassageContent("");
        fetchAdminData();
      }
    } catch (err) {
      setStatusMessage("Failed to create passage.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--color-primary-light)] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted)] text-sm uppercase tracking-wider mb-1">
              Total Users
            </p>
            <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
          <Users className="w-12 h-12 text-indigo-500 opacity-50" />
        </div>
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted)] text-sm uppercase tracking-wider mb-1">
              Total Sessions
            </p>
            <p className="text-4xl font-bold">{stats?.totalSessions || 0}</p>
          </div>
          <Activity className="w-12 h-12 text-green-500 opacity-50" />
        </div>
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted)] text-sm uppercase tracking-wider mb-1">
              Passages
            </p>
            <p className="text-4xl font-bold">{stats?.totalPassages || 0}</p>
          </div>
          <FileText className="w-12 h-12 text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-[var(--color-text-muted)] text-sm">
              <tr>
                <th className="p-4 rounded-tl-lg">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Target Exam</th>
                <th className="p-4 rounded-tr-lg">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/5"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${user.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-indigo-500/20 text-indigo-400"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">{user.profile?.examTarget || "SSC"}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-[var(--color-surface-2)] p-6 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-xl font-bold mb-4 border-b border-[var(--color-border)] pb-2">
          Add New Passage
        </h2>
        <form onSubmit={handleCreatePassage} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Passage Title
            </label>
            <input
              type="text"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] p-3 rounded"
              value={passageTitle}
              onChange={(e) => setPassageTitle(e.target.value)}
              placeholder="e.g. Official SSC Dictation 2023"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Content (Raw Text)
            </label>
            <textarea
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] p-3 rounded font-mono text-sm min-h-[150px] resize-y"
              value={passageContent}
              onChange={(e) => setPassageContent(e.target.value)}
              placeholder="Paste passage contents here..."
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Create Passage
          </button>
          {statusMessage && (
            <p className="text-green-400 mt-2 text-sm">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
