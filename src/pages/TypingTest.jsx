import React, { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import TypingBox from "../components/typing/TypingBox";
import ResultsScreen from "../components/typing/ResultsScreen";
import api from "../services/api";
import toast from "react-hot-toast";

const TypingTest = () => {
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionSaved, setSessionSaved] = useState(null);

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
      const res = await api.get("/texts/random?difficulty=beginner");
      if (res.data.success && res.data.text) {
        setPassage(res.data.text);
      }
    } catch (err) {
      toast.error("Failed to load text passage.");
    } finally {
      setLoading(false);
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
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[var(--color-text)] mb-2">
          Practice Typing
        </h2>
        <p className="text-[var(--color-text-muted)] text-lg">
          Type the text exactly as it appears below.
        </p>
      </div>

      <div className="w-full relative">
        <TypingBox
          charStates={charStates}
          targetText={targetText}
          handleKeyPress={handleKeyPress}
          isStarted={isStarted}
          wpm={wpm}
          accuracy={accuracy}
          elapsedTime={elapsedSeconds}
        />

        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]/10 backdrop-blur-[2px] z-10 rounded-xl pointer-events-none">
            <span className="text-xl font-bold bg-[var(--color-surface)] px-6 py-2 border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] shadow-2xl animate-bounce">
              Type any letter to begin
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleRestart}
          className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-6 py-2 rounded-lg text-lg hover:bg-[var(--color-border)] transition border border-[var(--color-border)] shadow"
        >
          Skip Passage
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
