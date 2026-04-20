import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Target, Flame, RotateCcw, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const PracticeModes = () => {
  const [streak, setStreak] = useState(0);
  const [adaptiveLevel, setAdaptiveLevel] = useState("intermediate");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/analysis/dashboard");
      if (res.data?.success) {
        setStreak(res.data.stats?.streak || 0);
        setAdaptiveLevel(res.data.stats?.adaptiveLevel || "intermediate");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAIPractice = async () => {
    // Generate AI passage logic and navigate to a specialized typing test view
    navigate("/ai-training");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-[var(--color-primary-light)] mb-2">
              Advanced Training Center
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg">
              Push your steno limits with AI-tailored regimes.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="bg-orange-500/10 border border-orange-500/50 text-orange-500 px-6 py-3 rounded-2xl flex items-center justify-center gap-3">
              <Flame size={24} className="animate-pulse" />
              <div className="text-center md:text-left">
                <span className="block text-xs uppercase font-bold tracking-widest text-[var(--color-text-muted)]">
                  Active Streak
                </span>
                <span className="text-xl font-black">{streak} Days</span>
              </div>
            </div>
            <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/50 text-[var(--color-primary-light)] px-6 py-3 rounded-2xl flex items-center justify-center gap-3">
              <ShieldCheck size={24} />
              <div className="text-center md:text-left">
                <span className="block text-xs uppercase font-bold tracking-widest text-[var(--color-text-muted)]">
                  Adaptive Level
                </span>
                <span className="text-xl font-black capitalize">
                  {adaptiveLevel}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Default Practice */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-xl hover:border-[var(--color-primary-light)] hover:-translate-y-2 transition-all flex flex-col h-full group relative overflow-hidden">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:bg-[var(--color-primary)]/20 text-[var(--color-text)]">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">
              Classic Practice
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 flex-1">
              Standard steno exams with randomly selected passages based on your
              general difficulty settings.
            </p>
            <Link
              to="/practice"
              className="w-full bg-[var(--color-surface-2)] text-white text-center py-4 rounded-xl font-bold border border-[var(--color-border)] hover:bg-[var(--color-border)] transition"
            >
              Start Classic
            </Link>
          </div>

          {/* AI Targeted Practice */}
          <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all flex flex-col h-full group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/50 text-indigo-400">
              <Brain size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
              AI Targeted Practice{" "}
              <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                PRO
              </span>
            </h2>
            <p className="text-indigo-200 mb-8 flex-1">
              An AI model dynamically writes a passage loaded entirely with your
              worst performing keys and patterns.
            </p>
            <button
              onClick={handleStartAIPractice}
              className="w-full bg-indigo-600 text-white text-center py-4 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 z-10"
            >
              Generate AI Passage
            </button>
          </div>

          {/* Error Drill Mode */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl shadow-xl hover:border-red-400 hover:-translate-y-2 transition-all flex flex-col h-full group relative overflow-hidden">
            <div className="w-16 h-16 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-border)] group-hover:bg-red-500/20 text-[var(--color-text)]">
              <RotateCcw size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Error Drill</h2>
            <p className="text-[var(--color-text-muted)] mb-8 flex-1">
              Muscle memory rehabilitation. Type your most frequently misspelled
              words on repeat until you break the habit.
            </p>
            <Link
              to="/error-drill"
              className="w-full bg-[var(--color-surface-2)] text-white text-center py-4 rounded-xl font-bold border border-[var(--color-border)] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition"
            >
              Start Drilling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeModes;
