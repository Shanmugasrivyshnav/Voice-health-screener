import styled from "styled-components";

export const StatusBadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;

  background: ${({ $status }) => {
    switch ($status) {
      case "LISTENING":
        return "#eff6ff";

      case "THINKING":
        return "#fefce8";

      case "SPEAKING":
        return "#f0fdf4";

      case "CONNECTING":
        return "#f5f3ff";

      case "CALL_ENDED":
        return "#f3f4f6";

      case "GENERATING_REPORT":
        return "#fff7ed";

      case "IDLE":
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "LISTENING":
        return "#1d4ed8";

      case "THINKING":
        return "#a16207";

      case "SPEAKING":
        return "#15803d";

      case "CONNECTING":
        return "#6d28d9";

      case "CALL_ENDED":
        return "#4b5563";

      case "GENERATING_REPORT":
        return "#c2410c";

      case "IDLE":
      default:
        return "#4b5563";
    }
  }};

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 12px;
  }
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $status }) => {
    switch ($status) {
      case "LISTENING":
        return "#2563eb";

      case "THINKING":
        return "#eab308";

      case "SPEAKING":
        return "#22c55e";

      case "CONNECTING":
        return "#8b5cf6";

      case "CALL_ENDED":
        return "#6b7280";

      case "GENERATING_REPORT":
        return "#f97316";

      case "IDLE":
      default:
        return "#9ca3af";
    }
  }};

  ${({ $status }) =>
    [
      "LISTENING",
      "THINKING",
      "SPEAKING",
      "CONNECTING",
      "GENERATING_REPORT",
    ].includes($status) &&
    `
      animation: pulse 1.5s ease-in-out infinite;
    `}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }

    50% {
      opacity: 0.5;
      transform: scale(0.85);
    }
  }
`;
