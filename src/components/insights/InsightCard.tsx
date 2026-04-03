// src/components/insights/InsightCard.tsx
import type { CSSProperties } from "react";
import type { InsightCard as InsightCardItem } from "@/lib/insights/types/insightCard.types";

type Props = {
  item: InsightCardItem;
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

const listStyle: CSSProperties = {
  margin: "6px 0 0 18px",
  padding: 0,
  lineHeight: 1.6,
};

const getScoreLabel = (score: InsightCardItem["score"]) => {
  return `score ${score.finalScore.toFixed(2)} / confidence ${score.confidence.toFixed(2)}`;
};

const getTrendLabel = (trend?: InsightCardItem["trend"]) => {
  if (!trend) return null;
  return `${trend.direction} ${trend.delta}`;
};

const InsightCard = ({ item }: Props) => {
  return (
    <div style={cardStyle}>
      <div style={metaRowStyle}>
        <span style={{ fontWeight: 700 }}>{item.meta.patternType}</span>
        <span style={badgeStyle}>{item.meta.strength}</span>
        <span style={badgeStyle}>{getScoreLabel(item.score)}</span>
        {item.trend ? <span style={badgeStyle}>{getTrendLabel(item.trend)}</span> : null}
      </div>

      <div style={{ lineHeight: 1.65 }}>
        <div>
          <span style={sectionLabelStyle}>Fact</span>
          <div>{item.narrative.fact}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <span style={sectionLabelStyle}>Boundary</span>
          <div>{item.narrative.boundary}</div>
        </div>

        {item.narrative.reflection ? (
          <div style={{ marginTop: 10 }}>
            <span style={sectionLabelStyle}>Reflection</span>
            <div>{item.narrative.reflection}</div>
          </div>
        ) : null}

        {item.actions.length > 0 ? (
          <div style={{ marginTop: 10 }}>
            <span style={sectionLabelStyle}>Actions</span>
            <ul style={listStyle}>
              {item.actions.map((action, index) => (
                <li key={`${action.title}-${index}`}>
                  {action.title} ({action.priority})
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InsightCard;