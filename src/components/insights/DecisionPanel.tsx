import type { CSSProperties } from "react";
import type { DecisionPanelData } from "@/lib/insights/types/decisionPanel.types";
import {
  formatPatternType,
  formatOutcomeDirection,
  formatConfidenceLabel,
} from "@/lib/insights/formatters/decisionFormatter";

type DecisionPanelProps = {
  data: DecisionPanelData | null;
};

const sectionStyle: CSSProperties = {
  border: "1px solid #eeeeee",
  borderRadius: 12,
  padding: 14,
  background: "#ffffff",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: "#111111",
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#222222",
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.6,
  color: "#666666",
};

const dividerStyle: CSSProperties = {
  border: 0,
  borderTop: "1px solid #eeeeee",
  margin: "14px 0",
};

const signalListStyle: CSSProperties = {
  margin: "10px 0 0 0",
  paddingLeft: 18,
  lineHeight: 1.6,
};

const stepListStyle: CSSProperties = {
  listStyle: "none",
  margin: "12px 0 0 0",
  padding: 0,
  display: "grid",
  gap: 10,
};

const stepItemStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  border: "1px solid #eeeeee",
  borderRadius: 10,
  padding: 12,
  background: "#fafafa",
};

const stepNumberStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "#111111",
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 700,
  flexShrink: 0,
  marginTop: 1,
};

const stepTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: "#111111",
};

const stepDescriptionStyle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: 13,
  lineHeight: 1.6,
  color: "#444444",
};

const badgeBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #dddddd",
  fontSize: 12,
  fontWeight: 700,
};

const getConfidenceBadgeStyle = (
  label: DecisionPanelData["confidence"]["label"],
): CSSProperties => {
  switch (label) {
    case "High":
      return {
        ...badgeBaseStyle,
        background: "#ecfdf3",
        borderColor: "#b7ebc6",
        color: "#166534",
      };
    case "Medium":
      return {
        ...badgeBaseStyle,
        background: "#fffbeb",
        borderColor: "#f6d58d",
        color: "#a16207",
      };
    case "Low":
      return {
        ...badgeBaseStyle,
        background: "#fef2f2",
        borderColor: "#f3b4b4",
        color: "#b91c1c",
      };
    default:
      return {
        ...badgeBaseStyle,
        background: "#f7f7f7",
        borderColor: "#dddddd",
        color: "#444444",
      };
  }
};

const headerBlockStyle: CSSProperties = {
  marginBottom: 14,
};

const labelStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: "#666666",
};

const decisionTextStyle: CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: 22,
  lineHeight: 1.45,
  fontWeight: 700,
  color: "#111111",
};

export const DecisionPanel = ({ data }: DecisionPanelProps) => {
  if (!data) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>No decision is available yet.</p>
          <p style={{ ...mutedTextStyle, marginTop: 6 }}>
            Upload data and run the analysis to generate a guided
            recommendation.
          </p>
        </div>
      </div>
    );
  }

  const formattedDirection = formatOutcomeDirection(data.outcome.direction);
  const supportingSignals = data.why.supportingSignals.slice(0, 3);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={headerBlockStyle}>
        <p style={labelStyle}>Primary Decision</p>
        <p style={decisionTextStyle}>{data.primaryDecision.message}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Why this matters</h3>
        <p style={{ ...bodyTextStyle, marginTop: 8 }}>{data.why.summary}</p>

        {supportingSignals.length > 0 ? (
          <ul style={signalListStyle}>
            {supportingSignals.map((signal, index) => (
              <li key={`${signal.type}-${index}`} style={mutedTextStyle}>
                {formatPatternType(signal.type)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>What to do</h3>

        {data.action.steps.length > 0 ? (
          <ol style={stepListStyle}>
            {data.action.steps.map((step) => (
              <li key={step.step} style={stepItemStyle}>
                <span style={stepNumberStyle}>{step.step}</span>

                <div>
                  <p style={stepTitleStyle}>{step.title}</p>
                  <p style={stepDescriptionStyle}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ ...mutedTextStyle, marginTop: 8 }}>
            No execution steps are available.
          </p>
        )}
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Expected outcome</h3>
        <p style={{ ...bodyTextStyle, marginTop: 8 }}>{data.outcome.summary}</p>

        {(data.outcome.improvement || formattedDirection) && (
          <>
            <hr style={dividerStyle} />

            <div style={{ display: "grid", gap: 6 }}>
              {data.outcome.improvement ? (
                <p style={mutedTextStyle}>
                  <strong style={{ color: "#111111" }}>
                    Estimated impact:
                  </strong>{" "}
                  {data.outcome.improvement}
                </p>
              ) : null}

              {formattedDirection ? (
                <p style={mutedTextStyle}>{formattedDirection}</p>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h3 style={sectionTitleStyle}>Confidence</h3>
          <span style={getConfidenceBadgeStyle(data.confidence.label)}>
            {formatConfidenceLabel(data.confidence.label)}
          </span>
        </div>

        {data.confidence.reasoning ? (
          <p style={{ ...mutedTextStyle, marginTop: 8 }}>
            {data.confidence.reasoning}
          </p>
        ) : null}
      </div>
    </div>
  );
};
