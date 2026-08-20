import styled from "styled-components";

export const HealthReportContainer = styled.div`
  width: 100%;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ReportTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 600;
`;

export const CompletenessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case "complete":
        return `
          color: #166534;
          background: #dcfce7;
        `;

      case "minimal":
        return `
          color: #92400e;
          background: #fef3c7;
        `;

      case "partial":
      default:
        return `
          color: #9a3412;
          background: #ffedd5;
        `;
    }
  }}

  @media (max-width: 768px) {
    white-space: normal;
  }
`;

export const ReportNotice = styled.p`
  margin: 0 0 16px;
  padding: 12px 14px;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
  background: #fffbeb;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
`;

export const ReportSummary = styled.p`
  margin: 0 0 24px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ReportFieldContainer = styled.div`
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

export const ReportFieldLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ReportFieldValue = styled.span`
  display: block;
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
`;

export const ReportRedFlags = styled.div`
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

export const RedFlagTitle = styled.strong`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const RedFlagList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

export const RedFlagItem = styled.li`
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;
