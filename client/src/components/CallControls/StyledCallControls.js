import styled from "styled-components";

export const CallControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LanguageSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const CallButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: ${({ $variant }) =>
    $variant === "start" ? "#16a34a" : "#dc2626"};

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === "start" ? "#15803d" : "#b91c1c"};
  }

  &:active {
    transform: translateY(1px);
  }
`;
