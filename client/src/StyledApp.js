import styled from "styled-components";

export const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const AppHeader = styled.header`
  max-width: 1200px;
  margin: 0 auto 24px;
`;

export const AppTitle = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const AppSubtitle = styled.p`
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Banner = styled.div`
  max-width: 1200px;
  margin: 0 auto 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "error":
        return "#fef2f2";

      case "empty":
        return "#f9fafb";

      case "warning":
      default:
        return "#fffbeb";
    }
  }};

  color: ${({ $variant }) => {
    switch ($variant) {
      case "error":
        return "#991b1b";

      case "empty":
        return "#6b7280";

      case "warning":
      default:
        return "#92400e";
    }
  }};

  border: 1px solid
    ${({ $variant }) => {
      switch ($variant) {
        case "error":
          return "#fecaca";

        case "empty":
          return "#e5e7eb";

        case "warning":
        default:
          return "#fde68a";
      }
    }};
`;

export const CallPanel = styled.div`
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    align-items: stretch;
    flex-direction: column;
    padding: 16px;
  }
`;

export const MicButton = styled.button`
  padding: 10px 16px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MainGrid = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  min-width: 0;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PanelTitle = styled.h2`
  margin: 0 0 16px;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
`;
