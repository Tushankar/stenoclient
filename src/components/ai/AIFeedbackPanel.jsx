import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Sparkles, TrendingUp, Target, Loader2 } from "lucide-react";
import api from "../../services/api";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15); // Adjust speed here

    return () => clearInterval(interval);
  }, [text]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const AIFeedbackPanel = ({ isOpen, onClose, session }) => {
  const [analysis, setAnalysis] = useState(session?.aiAnalysis || null);
  const [readiness, setReadiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && session && !analysis && !isLoading) {
      fetchAnalysis();
    }
    if (isOpen && !readiness) {
      fetchReadiness();
    }
  }, [isOpen, session]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await api.post(`/ai/analyze/${session._id}`);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      toast.error("Failed to generate AI analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReadiness = async () => {
    try {
      const res = await api.get("/ai/readiness");
      if (res.data.success && res.data.readiness) {
        setReadiness(res.data.readiness);
      }
    } catch (err) {
      // Silently fail if not enough sessions
    }
  };

  const handleGeneratePractice = async () => {
    toast.success("Feature coming in Phase 6: Targeted Practice Mode!");
    // In Phase 6, we will route to a new AI Practice track
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col pt-20"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
              <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-primary-light)]">
                <Brain className="text-purple-400" /> AI Coach Analysis
              </h2>
              <button
                onClick={onClose}
                className="text-[var(--color-text-muted)] hover:text-white transition bg-[var(--color-surface-2)] p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Exam Readiness Widget */}
              {readiness && (
                <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                  <h3 className="font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                    <Target size={14} className="text-indigo-400" /> Exam
                    Readiness
                  </h3>

                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="85%"
                          outerRadius="100%"
                          barSize={12}
                          data={[
                            {
                              value: readiness.score,
                              fill: "var(--color-accent)",
                            },
                          ]}
                          startAngle={180}
                          endAngle={0}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                          />
                          <RadialBar
                            background={{ fill: "var(--color-surface-2)" }}
                            dataKey="value"
                            cornerRadius={5}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col items-center justify-center pt-2">
                        <span className="text-2xl font-black text-white">
                          {readiness.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-bold text-lg ${readiness.score >= 80 ? "text-green-400" : readiness.score >= 50 ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {readiness.level}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
                        {readiness.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Text */}
              <div className="space-y-4">
                <h3 className="font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-xs flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" /> Session
                  Feedback
                </h3>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)]/50">
                    <Loader2
                      className="animate-spin mb-4 text-indigo-400"
                      size={32}
                    />
                    <p className="animate-pulse font-medium">
                      Groq AI is analyzing your keystrokes...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-indigo max-w-none text-[var(--color-text)] leading-relaxed bg-[var(--color-surface-2)] p-6 rounded-xl border border-[var(--color-border)] prose-p:my-2 prose-strong:text-[var(--color-primary-light)]">
                    {/* Animated typing effect implementation */}
                    {analysis ? (
                      <TypewriterText text={analysis} />
                    ) : (
                      <div className="text-[var(--color-text-muted)] italic">
                        No analysis available for this session.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <button
                onClick={handleGeneratePractice}
                className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-transform hover:scale-[1.02] shadow-lg shadow-[var(--color-primary)]/20"
              >
                <TrendingUp size={18} />
                Generate Targeted Practice
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIFeedbackPanel;
