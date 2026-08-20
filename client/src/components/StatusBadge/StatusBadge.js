import React from "react";
import { StatusBadgeContainer, StatusDot } from "./StyledStatusBadge";

const LABELS = {
  IDLE: "Idle",
  LISTENING: "Listening…",
  THINKING: "Thinking…",
  SPEAKING: "Speaking…",
  CONNECTING: "Connecting…",
  CALL_ENDED: "Call ended",
  GENERATING_REPORT: "Generating report…",
};

export default function StatusBadge({ status }) {
  const label = LABELS[status] || status;

  return (
    <StatusBadgeContainer $status={status}>
      <StatusDot $status={status} />
      {label}
    </StatusBadgeContainer>
  );
}
