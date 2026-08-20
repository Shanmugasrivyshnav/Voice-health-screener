import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";

import { getAIResponse, generateHealthReport } from "../services/llmService.js";

export function setupCallWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (ws) => {
    const session = {
      id: randomUUID(),
      transcriptHistory: [],
      language: "en",
      isProcessing: false,
      startedAt: null,
    };

    console.log(`WebSocket connected: ${session.id}`);

    const send = (event, data = {}) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            event,
            ...data,
          }),
        );
      }
    };

    ws.on("message", async (raw) => {
      let payload;

      // Parse incoming message
      try {
        payload = JSON.parse(raw.toString());
      } catch {
        send("ERROR", {
          message: "Malformed message payload.",
          recoverable: true,
        });
        return;
      }

      try {
        switch (payload.event) {
          // --------------------------------
          // START CALL
          // --------------------------------
          case "START_CALL": {
            session.transcriptHistory = [];
            session.language = payload.language === "hi" ? "hi" : "en";
            session.startedAt = Date.now();

            send("STATUS", {
              data: "CONNECTED",
            });

            send("STATUS", {
              data: "THINKING",
            });

            const greeting = await getAIResponse(
              session.transcriptHistory,
              session.language,
            );

            session.transcriptHistory.push({
              role: "assistant",
              content: greeting,
            });

            send("AGENT_TEXT", {
              text: greeting,
            });

            send("STATUS", {
              data: "IDLE",
            });

            break;
          }

          // --------------------------------
          // USER TRANSCRIPT
          // --------------------------------
          case "USER_TRANSCRIPT": {
            if (session.isProcessing) {
              return;
            }

            const text = String(payload.text || "").trim();

            if (!text) {
              send("ERROR", {
                message: "Didn't catch that — could you say it again?",
                recoverable: true,
              });

              return;
            }

            if (payload.language === "hi" || payload.language === "en") {
              session.language = payload.language;
            }

            session.isProcessing = true;

            session.transcriptHistory.push({
              role: "user",
              content: text,
            });

            send("STATUS", {
              data: "THINKING",
            });

            try {
              const agentReply = await getAIResponse(
                session.transcriptHistory,
                session.language,
              );

              session.transcriptHistory.push({
                role: "assistant",
                content: agentReply,
              });

              send("AGENT_TEXT", {
                text: agentReply,
              });

              send("STATUS", {
                data: "IDLE",
              });
            } catch (error) {
              console.error("LLM turn failed:", error);

              send("ERROR", {
                message: "I had trouble processing that. Could you try again?",
                recoverable: true,
              });

              send("STATUS", {
                data: "IDLE",
              });
            } finally {
              session.isProcessing = false;
            }

            break;
          }

          // --------------------------------
          // END CALL
          // --------------------------------
          case "END_CALL": {
            send("STATUS", {
              data: "GENERATING_REPORT",
            });

            try {
              const report = await generateHealthReport(
                session.transcriptHistory,
              );

              send("FINAL_REPORT", {
                report,
                transcript: session.transcriptHistory,
              });
            } catch (error) {
              console.error("Report generation failed:", error);

              send("ERROR", {
                message:
                  "Could not generate the report. Please try ending the call again.",
                recoverable: true,
              });
            }

            send("STATUS", {
              data: "CALL_ENDED",
            });

            break;
          }

          default: {
            console.warn("Unknown event type:", payload.event);

            send("ERROR", {
              message: "Unknown event type.",
              recoverable: true,
            });
          }
        }
      } catch (error) {
        console.error("WebSocket processing error:", error);

        send("ERROR", {
          message: "Something went wrong processing that.",
          recoverable: true,
        });
      }
    });

    ws.on("close", () => {
      console.log(`WebSocket disconnected: ${session.id}`);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error (${session.id}):`, error);
    });
  });

  return wss;
}
