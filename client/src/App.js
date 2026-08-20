import { useCallback, useRef, useState } from "react";

import CallControls from "./components/CallControls/CallControls";
import StatusBadge from "./components/StatusBadge/StatusBadge";
import Transcript from "./components/Transcript/Transcript";
import HealthReport from "./components/HealthReport/HealthReport";

import {
  AppContainer,
  AppHeader,
  AppTitle,
  AppSubtitle,
  Banner,
  CallPanel,
  MicButton,
  MainGrid,
  Panel,
  PanelTitle,
} from "./StyledApp";

import { useWebSocket } from "./Hooks/useWebSocket";

import {
  useSpeechRecognition,
  isSpeechRecognitionSupported,
} from "./Hooks/useSpeechRecognition";

import {
  useSpeechSynthesis,
  isSpeechSynthesisSupported,
} from "./Hooks/useSpeechSynthesis";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [callActive, setCallActive] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const languageRef = useRef(language);
  const listenSessionRef = useRef(0);

  languageRef.current = language;

  /* ------------ ERROR HANDLER ------------ */

  const showError = useCallback((message, duration = 5000) => {
    setErrorMsg(message);

    setTimeout(() => {
      setErrorMsg(null);
    }, duration);
  }, []);

  /* ------------ SPEECH RECOGNITION  ------------ */

  const { startListening, stopListening, isListening } = useSpeechRecognition({
    onResult: (transcript, token) => {
      if (token !== listenSessionRef.current) {
        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "user",
          content: transcript,
        },
      ]);

      send("USER_TRANSCRIPT", {
        text: transcript,
        language: languageRef.current,
      });
    },

    onNoSpeech: (token) => {
      if (token !== listenSessionRef.current) {
        return;
      }

      showError("Didn't catch that — tap the mic and try again.", 4000);

      setStatus("IDLE");
    },

    onError: (message) => {
      showError(message);
      setStatus("IDLE");
    },
  });

  /* ------------ SPEECH SYNTHESIS ------------ */

  const handleSpeechEnd = useCallback(() => {
    setStatus("LISTENING");

    listenSessionRef.current += 1;

    startListening(languageRef.current, listenSessionRef.current);
  }, [startListening]);

  const { speak, cancel: cancelSpeech } = useSpeechSynthesis({
    onEnd: handleSpeechEnd,
  });

  /* ------------ WEBSOCKET EVENTS ------------ */

  const handleWsEvent = useCallback(
    (payload) => {
      switch (payload.event) {
        case "STATUS":
          if (payload.data === "CALL_ENDED") {
            setCallActive(false);
          }

          setStatus(payload.data);
          break;

        case "AGENT_TEXT":
          setMessages((previous) => [
            ...previous,
            {
              role: "assistant",
              content: payload.text,
            },
          ]);

          setStatus("SPEAKING");

          speak(payload.text, languageRef.current);

          break;

        case "FINAL_REPORT":
          setReport(payload.report);
          break;

        case "ERROR":
          showError(payload.message);
          break;

        default:
          break;
      }
    },
    [speak, showError],
  );

  /* ------------ WEBSOCKET ------------ */

  const { connect, send } = useWebSocket(handleWsEvent);

  /* ------------ START CALL ------------ */

  const handleStart = useCallback(async () => {
    if (!isSpeechRecognitionSupported) {
      showError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge.",
      );

      return;
    }

    setMessages([]);
    setReport(null);
    setStatus("CONNECTING");

    try {
      await connect();

      setCallActive(true);

      send("START_CALL", {
        language,
      });
    } catch {
      showError("Could not connect to the server. Is it running?");

      setStatus("IDLE");
    }
  }, [connect, send, language, showError]);

  /* ------------ END CALL ------------ */

  const handleEnd = useCallback(() => {
    cancelSpeech();
    stopListening();

    send("END_CALL");

    setStatus("GENERATING_REPORT");
  }, [cancelSpeech, stopListening, send]);

  /* ------------ MICROPHONE / BARGE-IN ------------ */

  const handleMicTap = useCallback(() => {
    // Invalidate old listening session.
    listenSessionRef.current += 1;

    // Interrupt the assistant if it is speaking.
    if (status === "SPEAKING") {
      cancelSpeech();
    }

    // Stop current recognition.
    stopListening();

    // Start a new listening session.
    if (!isListening) {
      setStatus("LISTENING");

      startListening(languageRef.current, listenSessionRef.current);
    }
  }, [status, isListening, cancelSpeech, stopListening, startListening]);

  /* ------------ UI ------------ */

  return (
    <AppContainer>
      <AppHeader>
        <AppTitle>Voice Health Intake</AppTitle>

        <AppSubtitle>
          Have a short spoken conversation with an AI intake assistant.
        </AppSubtitle>
      </AppHeader>

      {!isSpeechRecognitionSupported && (
        <Banner $variant="warning">
          Your browser doesn't support the Web Speech API. Please switch to
          Chrome or Edge.
        </Banner>
      )}

      {!isSpeechSynthesisSupported && (
        <Banner $variant="warning">
          Your browser doesn't support speech synthesis.
        </Banner>
      )}

      {errorMsg && <Banner $variant="error">{errorMsg}</Banner>}

      <CallPanel>
        <StatusBadge status={status} />

        <CallControls
          callActive={callActive}
          onStart={handleStart}
          onEnd={handleEnd}
          language={language}
          onLanguageChange={setLanguage}
        />

        {callActive && (
          <MicButton
            type="button"
            onClick={handleMicTap}
            disabled={status === "THINKING"}
          >
            🎙 Tap to speak / interrupt
          </MicButton>
        )}
      </CallPanel>

      <MainGrid>
        <Panel>
          <PanelTitle>Transcript</PanelTitle>

          <Transcript messages={messages} />
        </Panel>

        <Panel>
          <PanelTitle>Report</PanelTitle>

          {report ? (
            <HealthReport report={report} />
          ) : (
            <Banner $variant="empty">
              The structured report will appear here after you end the call.
            </Banner>
          )}
        </Panel>
      </MainGrid>
    </AppContainer>
  );
}
