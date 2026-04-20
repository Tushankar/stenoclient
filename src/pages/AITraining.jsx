import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Settings, Loader2, Library } from "lucide-react";
import api from "../services/api";
import PassageBrowser from "../components/PassageBrowser";
import { useTypingEngine } from "../hooks/useTypingEngine";
import TypingBox from "../components/typing/TypingBox";
import ResultsScreen from "../components/typing/ResultsScreen";
import toast from "react-hot-toast";

const AITraining = () => {
  const [loading, setLoading] = useState(true);
  const [passageText, setPassageText] = useState("");
  const [sessionSaved, setSessionSaved] = useState(null);
  const [showBrowser, setShowBrowser] = useState(false);

  useEffect(() => {
    generateAIPassage();
  }, []);

  const generateAIPassage = async () => {
    setLoading(true);
    try {
      // Get weak keys first to feed the generation
      let weakKeys = [];
      let weakPatterns = [];

      try {
        const hkRes = await api.get("/analysis/weak-keys");

        weakKeys = hkRes.data?.heatmapData?.slice(0, 5).map((k) => k.key) || [];
        weakPatterns = hkRes.data?.slowBigrams?.slice(0, 3) || [];
      } catch (e) {
        console.warn("Could not load weak keys for AI prompt. Using defaults.");
        weakKeys = ["z", "q", "p"];
        weakPatterns = ["th", "re"];
      }

      // Generate the target AI passage using Phase 5 /api/ai/generate-passage
      const res = await api.post("/ai/generate-passage", {
        weakKeys,
        weakPatterns,
        level: "advanced", // Integrate adaptiveDifficultyService later via user profile settings
        wordCount: 150,
      });

      if (res.data.success) {
        setPassageText(res.data.passage?.content || res.data.passage);
      }
    } catch (err) {
      toast.error("AI Generation failed. Falling back to default text.");
      setPassageText(
        "The artificial intelligence fallback passage triggers when the primary API fails.",
      );
    } finally {
      setLoading(false);
    }
  };

  const {
    charStates,
    isStarted,
    isFinished,
    handleKeyPress,
    accuracy,
    wpm,
    elapsedSeconds,
    typedText,
    keystrokeData,
    reset,
    backspaceMode,
    setBackspaceMode,
  } = useTypingEngine(passageText);

  useEffect(() => {
    if (isFinished && !sessionSaved) {
      saveSpecialSession();
    }
  }, [isFinished, sessionSaved]);

  const saveSpecialSession = async () => {
    try {
      const payload = {
        passageId: null, // Custom generated, doesn't map to predefined TextPassage
        expectedText: passageText,
        typedText: typedText,
        keystrokeData: keystrokeData,
        duration: elapsedSeconds,
        mode: "practice", // Mark as targeted practice
      };

      const res = await api.post("/sessions", payload);
      if (res.data.success) {
        setSessionSaved(res.data.session);
        toast.success("AI target session scored and saved!");
      }
    } catch (err) {
      toast.error("Failed to save targeted session.");
    }
  };

  const handleSelectPassage = (passage) => {
    setPassageText(passage.content);
    reset();
    setShowBrowser(false);
    toast.success(`Selected: ${passage.title}`);
  };

  if (sessionSaved) return <ResultsScreen session={sessionSaved} />;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col p-8 items-center bg-[var(--color-bg)]">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <h2 className="text-2xl font-black">AI Architecting Passage...</h2>
          <p className="text-[var(--color-text-muted)] italic mt-2 text-center max-w-sm">
            Groq Llama-3 is analyzing your error matrix and forging a custom
            sequence targeting your exact weaknesses.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-4xl">
            <header className="flex flex-col md:flex-row items-center justify-between mb-10 pb-6 border-b border-[var(--color-border)]">
              <div>
                <h1 className="text-3xl font-black text-indigo-400 flex items-center justify-center md:justify-start gap-3">
                  <Brain size={32} className="text-indigo-500" />
                  Targeted Steno Session
                </h1>
                <p className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest mt-2">
                  <span className="font-bold text-indigo-300">
                    Level: ADVANCED
                  </span>{" "}
                  • 150 Words
                </p>
              </div>
              <div className="flex gap-4 mt-6 md:mt-0">
                <button
                  onClick={() => setShowBrowser(true)}
                  className="px-6 py-2 bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-sm font-bold shadow hover:bg-[var(--color-border)] transition flex items-center gap-2"
                >
                  <Library size={16} /> Browse
                </button>
                <Link
                  to="/training"
                  className="px-6 py-2 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-full text-sm font-bold shadow hover:text-white transition"
                >
                  Abort Training
                </Link>
                <button
                  onClick={() => {
                    reset();
                    generateAIPassage();
                  }}
                  className="px-6 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-sm font-bold shadow hover:bg-indigo-500/40 transition"
                >
                  Re-Roll Passage
                </button>
              </div>
            </header>

            <div className="w-full relative shadow-2xl shadow-indigo-900/10 mb-8">
              <TypingBox
                charStates={charStates}
                targetText={passageText}
                handleKeyPress={handleKeyPress}
                isStarted={isStarted}
                wpm={wpm}
                accuracy={accuracy}
                elapsedTime={elapsedSeconds}
                backspaceMode={backspaceMode}
                setBackspaceMode={setBackspaceMode}
              />

              {!isStarted && !isFinished && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/10 backdrop-blur-[1px] z-10 rounded-[1.25rem] pointer-events-none">
                  <span className="text-xl font-bold bg-indigo-600 px-8 py-3 ring-[6px] ring-indigo-500/30 rounded-full text-white shadow-2xl shadow-indigo-500/50 animate-pulse">
                    Aged for you. Type to begin.
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showBrowser && (
        <PassageBrowser
          onSelectPassage={handleSelectPassage}
          onClose={() => setShowBrowser(false)}
          mode="ai-training"
        />
      )}
    </div>
  );
};

export default AITraining;
