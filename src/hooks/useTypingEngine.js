import { useState, useEffect, useRef, useCallback } from "react";

export function useTypingEngine(targetText) {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentIndex, setCurrentIndex] = useState(0);
  const keystrokeData = useRef([]);
  const lastKeystrokeTime = useRef(null);

  const handleKeyPress = useCallback(
    (key) => {
      if (isFinished) return;

      if (!isStarted) {
        setIsStarted(true);
        setStartTime(Date.now());
      }

      const now = Date.now();
      const delay = lastKeystrokeTime.current
        ? now - lastKeystrokeTime.current
        : 0;
      lastKeystrokeTime.current = now;

      if (key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.length !== 1) return;

      const newTyped = typedText + key;
      const isCorrect = targetText[currentIndex] === key;

      keystrokeData.current.push({
        key,
        timestamp: now,
        correct: isCorrect,
        delayMs: delay,
      });

      setTypedText(newTyped);
      setCurrentIndex((prev) => prev + 1);

      // Calculate WPM + accuracy live
      if (startTime) {
        const minutes = (now - startTime) / 60000;
        // Standard WPM: (characters / 5) / minutes
        const wpmValue = Math.round(newTyped.length / 5 / minutes);
        setWpm(wpmValue || 0);
      }

      let correct = 0;
      for (let i = 0; i < newTyped.length; i++) {
        if (newTyped[i] === targetText[i]) correct++;
      }
      setAccuracy(Math.round((correct / newTyped.length) * 100) || 100);

      if (newTyped.length >= targetText.length) setIsFinished(true);
    },
    [typedText, currentIndex, isStarted, isFinished, startTime, targetText],
  );

  const reset = useCallback(() => {
    setTypedText("");
    setStartTime(null);
    setIsStarted(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setCurrentIndex(0);
    keystrokeData.current = [];
    lastKeystrokeTime.current = null;
  }, []);

  // Build character states for rendering
  const charStates = (typeof targetText === "string" ? targetText : "").split("").map((char, i) => {
    if (i < typedText.length) {
      return typedText[i] === char ? "correct" : "incorrect";
    }
    if (i === typedText.length) return "cursor";
    return "pending";
  });

  useEffect(() => {
    reset();
  }, [targetText, reset]);

  return {
    typedText,
    wpm,
    accuracy,
    isStarted,
    isFinished,
    charStates,
    keystrokeData: keystrokeData.current,
    handleKeyPress,
    reset,
    elapsedSeconds: startTime ? Math.round((Date.now() - startTime) / 1000) : 0,
  };
}
