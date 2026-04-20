import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Activity, Percent, Layers, Trophy } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import WeakKeyPanel from "../components/dashboard/WeakKeyPanel";
import RecentSessions from "../components/dashboard/RecentSessions";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [movingAvg, setMovingAvg] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, progRes, weakRes] = await Promise.all([
        api.get("/analysis/dashboard"),
        api.get("/analysis/progress"),
        api.get("/analysis/weak-keys"),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
        setRecent(dashRes.data.recent);
      }
      if (progRes.data.success) {
        setProgressData(progRes.data.wpmTrend);
        setMovingAvg(progRes.data.movingAvg);
      }
      if (weakRes.data.success) {
        setHeatmapData(weakRes.data.heatmapData);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-2xl animate-pulse text-[var(--color-primary-light)]">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--color-bg)] min-h-screen text-[var(--color-text)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-[var(--color-primary-light)] tracking-tight">
          Your Dashboard
        </h1>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Avg WPM"
            value={stats?.avgWPM || 0}
            icon={<Activity />}
            colorClass="text-[var(--color-primary)] bg-[var(--color-primary)]/10"
            highlight
          />
          <StatsCard
            title="Accuracy"
            value={`${stats?.avgAccuracy || 0}%`}
            icon={<Percent />}
            colorClass="text-[var(--color-accent)] bg-[var(--color-accent)]/10"
          />
          <StatsCard
            title="Sessions"
            value={stats?.totalSessions || 0}
            icon={<Layers />}
            colorClass="text-[var(--color-text-muted)] bg-[var(--color-text)]/10"
          />
          <StatsCard
            title="Best WPM"
            value={stats?.bestWPM || 0}
            icon={<Trophy />}
            colorClass="text-yellow-400 bg-yellow-400/10"
          />
        </div>

        {/* Charts & Heatmap Row */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-2 w-full lg:w-2/3 bg-[var(--color-surface-2)] p-6 rounded-xl border border-[var(--color-border)] shadow-lg relative">
            <h3 className="text-[var(--color-text-muted)] text-sm tracking-widest uppercase mb-6 border-b border-[var(--color-border)] pb-2 flex justify-between">
              <span>WPM Progress & Moving Avg</span>
              <span className="text-[var(--color-accent)] font-bold text-xs bg-[var(--color-accent)]/10 px-2 py-1 rounded">
                30-Day Trend
              </span>
            </h3>
            <ProgressChart data={progressData} movingAvg={movingAvg} />
          </div>

          <div className="w-full lg:w-1/3 flex">
            <WeakKeyPanel data={heatmapData} />
          </div>
        </div>

        {/* Bottom Panel */}
        <RecentSessions sessions={recent} />
      </div>
    </div>
  );
};

export default Dashboard;
