import { useCallback, useRef, useState } from "react";
/*import {
  useSpeechRecognition,
  isSpeechRecognitionSupported,
} from "../hooks/useSpeechRecognition";
*/

const SpeechRecognitionImpl =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const isSpeechRecognitionSupported = Boolean(SpeechRecognitionImpl);

/* Wraps the browser's native SpeechRecognition (Web Speech API) for one push-to-talk turn at a time.*/
export function useSpeechRecognition({
  onResult,
  onError,
  onNoSpeech,
  maxRetries = 2,
}) {
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const retryTimerRef = useRef(null);

  const startListening = useCallback(
    (language = "en", sessionToken = null) => {
      if (!SpeechRecognitionImpl) {
        onError?.(
          "Speech recognition is not supported in this browser. Try Chrome or Edge.",
        );
        return;
      }

      clearTimeout(retryTimerRef.current);

      let attempts = 0;

      const startOnce = () => {
        if (!SpeechRecognitionImpl) return;

        const recognition = new SpeechRecognitionImpl();

        recognition.lang = language === "hi" ? "hi-IN" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        let gotResult = false;

        recognition.onresult = (event) => {
          gotResult = true;

          clearTimeout(retryTimerRef.current);

          const transcript = event.results[0]?.[0]?.transcript || "";

          onResult?.(transcript, sessionToken);
        };

        recognition.onerror = (event) => {
          if (event.error === "no-speech") {
            return;
          }

          if (event.error !== "aborted") {
            onError?.(`Microphone error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);

          if (gotResult) return;

          attempts += 1;

          if (attempts <= maxRetries) {
            retryTimerRef.current = setTimeout(() => {
              if (!recognitionRef.current) return;

              setIsListening(true);
              startOnce();
            }, 300);
          } else {
            onNoSpeech?.(sessionToken);
          }
        };

        recognitionRef.current = recognition;

        setIsListening(true);
        recognition.start();
      };

      startOnce();
    },
    [onResult, onError, onNoSpeech, maxRetries],
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // Ignore stop errors.
    }

    recognitionRef.current = null;

    clearTimeout(retryTimerRef.current);

    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
  };
}
