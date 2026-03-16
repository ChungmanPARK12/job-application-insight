// src/components/insights/InsightCard.tsx
import type { CSSProperties } from "react";
import type { InsightNarrative } from "@/lib/insights/narration.types";

type Props = {
  item: InsightNarrative;
};

const cardStyle: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  marginBottom: 10,
};

const badgeStyle: CSSProperties = {
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  background: "#f5f5f5",
  border: "1px solid #eaeaea",
};

const sectionLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  textTransform: "uppercase",
  display: "inline-block",
  marginBottom: 4,
};

const getConfidenceLabel = (confidence: InsightNarrative["confidence"]) => {
  return `${confidence} confidence`;
};

const InsightCard = ({ item }: Props) => {
  return (
    <div style={cardStyle}>
      <div style={metaRowStyle}>
        <span style={{ fontWeight: 700 }}>{item.pattern_type}</span>
        <span style={badgeStyle}>{item.strength}</span>
        <span style={badgeStyle}>{getConfidenceLabel(item.confidence)}</span>
        <span style={badgeStyle}>{item.stage}</span>
      </div>

      <div style={{ lineHeight: 1.65 }}>
        <div>
          <span style={sectionLabelStyle}>Fact</span>
          <div>{item.fact}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <span style={sectionLabelStyle}>Boundary</span>
          <div>{item.boundary}</div>
        </div>

        {item.reflection ? (
          <div style={{ marginTop: 10 }}>
            <span style={sectionLabelStyle}>Reflection</span>
            <div>{item.reflection}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InsightCard;