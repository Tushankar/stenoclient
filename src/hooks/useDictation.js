import { useState, useRef, useCallback, useEffect } from 'react';

export function useDictation(text, wpm, language = "english") {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const utteranceRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Clear speech synth on unmount
  useEffect(() => {
    return () => {
      synthRef.current.cancel();
    };
  }, []);

  const play = useCallback(() => {
    const synth = synthRef.current;
    if (synth.speaking && !isPaused) return;

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synth.cancel();
    setCurrentWordIndex(0);
    setIsFinished(false);

    // Build utterance with pauses via sentence splitting
    // Handle punctuation and split extremely long lines (>300 chars) for stability
    const splitText = (input) => {
      // Split by common punctuation
      const initialSplit = input.match(/[^.!?;]+[.!?;]?/g) || [input];
      const finalChunks = [];

      initialSplit.forEach((chunk) => {
        if (chunk.length > 300) {
          // Sub-split long chunks by comma or space
          const subChunks = chunk.match(/.{1,300}(\s|$)/g) || [chunk];
          finalChunks.push(...subChunks);
        } else {
          finalChunks.push(chunk);
        }
      });
      return finalChunks;
    };

    const sentences = splitText(text);

    const speakSentences = (index) => {
      // If stopped or finished
      if (!isPlaying && index > 0) return; 

      if (index >= sentences.length) {
        setIsFinished(true);
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[index].trim());
      
      // Standardize rate: 1.0 is roughly 150-160 WPM in many modern browsers.
      // We'll use 150 as a more realistic baseline for WPM to rate mapping.
      utterance.rate = Math.max(0.5, Math.min(2.0, wpm / 150)); 
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = language === "hindi" ? "hi-IN" : "en-IN";

      utterance.onend = () => {
        // Reduced pause for better flow, tailored to punctuation
        const lastChar = sentences[index].trim().slice(-1);
        const pauseDelay = [".", "!", "?", ";"].includes(lastChar) ? 300 : 150;
        
        utteranceRef.current = setTimeout(() => speakSentences(index + 1), pauseDelay);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlaying(false);
      };

      synth.speak(utterance);
    };

    setIsPlaying(true);
    speakSentences(0);
  }, [text, wpm, isPaused]);

  const pause = useCallback(() => {
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    synthRef.current.cancel();
    if (utteranceRef.current) clearTimeout(utteranceRef.current);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  }, []);

  const replay = useCallback(() => {
    stop();
    setTimeout(play, 100);
  }, [stop, play]);

  return { isPlaying, isPaused, isFinished, currentWordIndex, play, pause, stop, replay };
}