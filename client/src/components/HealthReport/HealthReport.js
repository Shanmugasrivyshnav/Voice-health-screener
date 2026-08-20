import React from "react";
import {
  HealthReportContainer,
  ReportHeader,
  ReportTitle,
  CompletenessBadge,
  ReportNotice,
  ReportSummary,
  ReportGrid,
  ReportFieldContainer,
  ReportFieldLabel,
  ReportFieldValue,
  ReportRedFlags,
  RedFlagTitle,
  RedFlagList,
  RedFlagItem,
} from "./StyledHealthReport";

const COMPLETENESS_LABEL = {
  complete: {
    text: "Complete",
    variant: "complete",
  },
  partial: {
    text: "Partial — call ended early",
    variant: "partial",
  },
  minimal: {
    text: "Minimal — very short call",
    variant: "minimal",
  },
};

function Field({ label, value }) {
  return (
    <ReportFieldContainer>
      <ReportFieldLabel>{label}</ReportFieldLabel>
      <ReportFieldValue>{value || "—"}</ReportFieldValue>
    </ReportFieldContainer>
  );
}

export default function HealthReport({ report }) {
  if (!report) return null;

  const completeness =
    COMPLETENESS_LABEL[report.callCompleteness] || COMPLETENESS_LABEL.partial;

  return (
    <HealthReportContainer>
      <ReportHeader>
        <ReportTitle>Health Intake Report</ReportTitle>

        <CompletenessBadge $variant={completeness.variant}>
          {completeness.text}
        </CompletenessBadge>
      </ReportHeader>

      {report.callCompleteness === "minimal" && (
        <ReportNotice>
          This call ended before meaningful information was collected. The
          fields below may be empty.
        </ReportNotice>
      )}

      <ReportSummary>{report.summary}</ReportSummary>

      <ReportGrid>
        <Field label="Patient Name" value={report.patientName} />

        <Field label="Chief Complaint" value={report.chiefComplaint} />

        <Field label="Onset / Duration" value={report.onsetDuration} />

        <Field label="Severity" value={report.severity} />

        <Field
          label="Associated Symptoms"
          value={
            report.associatedSymptoms?.length
              ? report.associatedSymptoms.join(", ")
              : null
          }
        />

        <Field
          label="Recommended Follow-Up"
          value={report.recommendedFollowUp}
        />
      </ReportGrid>

      {report.redFlags?.length > 0 && (
        <ReportRedFlags>
          <RedFlagTitle>⚠ Flagged for attention:</RedFlagTitle>

          <RedFlagList>
            {report.redFlags.map((flag, index) => (
              <RedFlagItem key={index}>{flag}</RedFlagItem>
            ))}
          </RedFlagList>
        </ReportRedFlags>
      )}
    </HealthReportContainer>
  );
}
