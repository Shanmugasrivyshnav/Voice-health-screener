import { useCallback, useRef, useState } from "react";

export const isSpeechSynthesisSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

/* Wraps the browser's native SpeechSynthesis (Web Speech API) for the TTS half of the pipeline.*/
export function useSpeechSynthesis({ onStart, onEnd } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback(
    (text, language = "en") => {
      if (!isSpeechSynthesisSupported || !text) return;

      // Clear any queued speech first.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utteranceRef.current = utterance;

      window.speechSynthesis.speak(utterance);
    },
    [onStart, onEnd],
  );

  // Allows the user to interrupt the agent while it is speaking.
  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    speak,
    cancel,
  };
}
