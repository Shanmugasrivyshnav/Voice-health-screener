import styled from "styled-components";

export const TranscriptContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const TranscriptEmpty = styled.p`
  margin: 0;
  padding: 24px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 18px 14px;
    font-size: 13px;
  }
`;

export const TranscriptRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border-radius: 8px;

  background: ${({ $role }) => ($role === "user" ? "#eff6ff" : "#f9fafb")};

  border-left: 3px solid
    ${({ $role }) => ($role === "user" ? "#2563eb" : "#9ca3af")};

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

export const TranscriptSpeaker = styled.span`
  color: ${({ $role }) => ($role === "user" ? "#1d4ed8" : "#4b5563")};

  font-size: 12px;
  font-weight: 600;
`;

export const TranscriptText = styled.p`
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;
