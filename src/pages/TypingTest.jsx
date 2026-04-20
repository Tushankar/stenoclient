import React, { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import TypingBox from "../components/typing/TypingBox";
import ResultsScreen from "../components/typing/ResultsScreen";
import PassageBrowser from "../components/PassageBrowser";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Sparkles,
  RefreshCcw,
  BookOpen,
  Settings2,
  RotateCw,
  Library,
} from "lucide-react";

const TypingTest = () => {
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionSaved, setSessionSaved] = useState(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  const [passagesList, setPassagesList] = useState([]);
  const [passageIndex, setPassageIndex] = useState(0);

  const [aiOptions, setAiOptions] = useState({
    topics: "",
    level: "intermediate",
  });
  const [generating, setGenerating] = useState(false);

  // Example passage. In real app, fetch from API.
  const targetText = passage?.content || "";

  const {
    typedText,
    wpm,
    accuracy,
    isStarted,
    isFinished,
    charStates,
    keystrokeData,
    handleKeyPress,
    reset,
    elapsedSeconds,
  } = useTypingEngine(targetText);

  useEffect(() => {
    fetchRandomPassage();
  }, []);

  useEffect(() => {
    if (isFinished && !sessionSaved) {
      saveSession();
    }
  }, [isFinished, sessionSaved]);

  const fetchRandomPassage = async () => {
    setLoading(true);
    try {
      const res = await api.get("/texts?difficulty=beginner&limit=50");
      if (res.data.success && res.data.texts && res.data.texts.length > 0) {
        const shuffled = res.data.texts.sort(() => 0.5 - Math.random());
        setPassagesList(shuffled);
        setPassage(shuffled[0]);
        setPassageIndex(0);
      }
    } catch (err) {
      toast.error("Failed to load text passages.");
    } finally {
      setLoading(false);
    }
  };

  const generateAiPassage = async (quickTopic = null) => {
    setGenerating(true);
    const topics = quickTopic || aiOptions.topics;
    try {
      const res = await api.post("/ai/generate-passage", {
        topics: topics,
        level: aiOptions.level,
        wordCount: 150,
      });
      if (res.data.success && res.data.passage) {
        setPassage(res.data.passage);
        setPassagesList([]); // Empty list since we are custom generating
        reset();
        toast.success("AI generated a unique passage for you!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const saveSession = async () => {
    try {
      const payload = {
        passageId: passage?._id,
        expectedText: targetText,
        typedText: typedText,
        keystrokeData: keystrokeData,
        duration: elapsedSeconds,
        mode: "typing",
      };

      const res = await api.post("/sessions", payload);
      if (res.data.success) {
        setSessionSaved(res.data.session);
        toast.success("Session saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save session data.");
      console.error(err);
    }
  };

  const handleRestart = () => {
    setSessionSaved(null);
    reset();
    fetchRandomPassage();
  };

  const handleChangePassage = async () => {
    reset();
    if (passagesList.length > 1) {
      const nextIndex = (passageIndex + 1) % passagesList.length;
      setPassageIndex(nextIndex);
      setPassage(passagesList[nextIndex]);
      toast.success("Swapped to next passage!");
    } else {
      await fetchRandomPassage();
      toast.success("New passage loaded!");
    }
  };

  const handleSelectFromBrowser = (selectedPassage) => {
    setPassage(selectedPassage);
    setPassagesList([]); // Selected specifically, clear dynamic loop
    reset();
    setShowBrowser(false);
    toast.success(`Loaded: ${selectedPassage.title}`);
  };

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
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl mb-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-[var(--color-primary-light)] mb-3 tracking-tight">
              Practice Typing
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Master your steno speed with curated or AI-powered passages.
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setShowBrowser(true)}
              title="Browse and select passages"
              className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition whitespace-nowrap"
            >
              <Library size={16} /> Browse
            </button>
            {!isAiMode && (
              <button
                onClick={handleChangePassage}
                disabled={isStarted || loading}
                title="Load a new passage"
                className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded-lg text-sm border border-[var(--color-border)] hover:bg-[var(--color-border)] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <RotateCw size={16} /> Change
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mb-8">
        <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-2xl w-fit mx-auto mb-8 shadow-inner">
          <button
            onClick={() => setIsAiMode(false)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${!isAiMode ? "bg-[var(--color-primary)] text-white shadow-lg" : "text-[var(--color-text-muted)] hover:text-white"}`}
          >
            <BookOpen size={18} /> Standard Mode
          </button>
          <button
            onClick={() => setIsAiMode(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${isAiMode ? "bg-[var(--color-accent)] text-white shadow-lg" : "text-[var(--color-text-muted)] hover:text-white"}`}
          >
            <Sparkles size={18} /> AI Mode
          </button>
        </div>

        {isAiMode && (
          <div className="bg-[var(--color-surface)] border-2 border-[var(--color-accent)]/30 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-indigo-500/10">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-accent)] mb-2">
                  Topics / Subject Matter
                </label>
                <input
                  type="text"
                  placeholder="e.g. Legal, Space, Indian History..."
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition"
                  value={aiOptions.topics}
                  onChange={(e) =>
                    setAiOptions({ ...aiOptions, topics: e.target.value })
                  }
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                  Difficulty
                </label>
                <select
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition"
                  value={aiOptions.level}
                  onChange={(e) =>
                    setAiOptions({ ...aiOptions, level: e.target.value })
                  }
                >
                  <option value="beginner">Easy</option>
                  <option value="intermediate">Medium</option>
                  <option value="advanced">Hard</option>
                </select>
              </div>
              <button
                disabled={generating}
                onClick={() => generateAiPassage()}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCcw className="animate-spin" size={20} />{" "}
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Generate
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-[var(--color-text-muted)] text-xs font-bold uppercase mr-2">
                Quick topics:
              </span>
              {["Legal", "Politics", "Science", "History"].map((t) => (
                <button
                  key={t}
                  onClick={() => generateAiPassage(t)}
                  disabled={generating}
                  className="bg-[var(--color-surface-2)] border border-[var(--color-border)] px-3 py-1 rounded-full text-xs font-bold hover:border-[var(--color-accent)] transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl relative">
        <TypingBox
          charStates={charStates}
          targetText={targetText}
          handleKeyPress={handleKeyPress}
          isStarted={isStarted}
          wpm={wpm}
          accuracy={accuracy}
          elapsedTime={elapsedSeconds}
        />

        {!isStarted && !generating && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black bg-[var(--color-surface)] px-10 py-3 border-2 border-[var(--color-primary)] rounded-full text-[var(--color-primary-light)] shadow-2xl animate-bounce">
              Start typing to begin
            </span>
          </div>
        )}

        {generating && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/60 backdrop-blur-[4px] z-20 rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <RefreshCcw
                size={48}
                className="animate-spin text-[var(--color-accent)]"
              />
              <span className="text-xl font-bold text-white">
                AI is crafting your passage...
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        {!isAiMode && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 bg-[var(--color-surface)] text-[var(--color-text)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-border)] transition border border-[var(--color-border)] shadow-xl"
          >
            <RefreshCcw size={18} /> New Static Passage
          </button>
        )}
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-border)] transition border border-[var(--color-border)] shadow-xl"
        >
          <RotateCw size={18} /> Restart Current
        </button>
      </div>

      {showBrowser && (
        <PassageBrowser
          onSelectPassage={handleSelectFromBrowser}
          onClose={() => setShowBrowser(false)}
          mode="typing"
        />
      )}
    </div>
  );
};

export default TypingTest;
