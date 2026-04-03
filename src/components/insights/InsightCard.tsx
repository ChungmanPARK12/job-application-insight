// src/components/insights/InsightCard.tsx
import type { CSSProperties } from "react";
import type { InsightCard as InsightCardItem } from "@/lib/insights/types/insightCard.types";

type Props = {
  item: InsightCardItem;
  isPrimary?: boolean;
};

const cardStyle = (isPrimary: boolean): CSSProperties => ({
  border: isPrimary ? "1px solid #d6c38a" : "1px solid #eee",
  borderRadius: 14,
  padding: 16,
  background: isPrimary ? "#fffaf0" : "#fff",
  boxShadow: isPrimary ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
});

const metaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  marginBottom: 12,
};

const badgeStyle = (variant: "default" | "primary" | "trend"): CSSProperties => ({
  fontSize: 12,
  padding: "4px 8px",
  borderRadius: 999,
  border: "1px solid #eaeaea",
  background:
    variant === "primary"
      ? "#fff3cd"
      : variant === "trend"
      ? "#f3f7ff"
      : "#f5f5f5",
});

const sectionLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.2,
  textTransform: "uppercase",
  display: "inline-block",
  marginBottom: 4,
};

const actionBlockStyle: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 10,
  padding: 10,
  background: "#fafafa",
};

const actionMetaRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 4,
};

const priorityBadgeStyle = (priority: string): CSSProperties => ({
  fontSize: 11,
  padding: "2px 8px",
  borderRadius: 999,
  border: "1px solid #e5e5e5",
  background:
    priority === "high"
      ? "#fff1f1"
      : priority === "medium"
      ? "#fff8e8"
      : "#f5f5f5",
  textTransform: "capitalize",
});

const formatPatternLabel = (value: string) => {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getScoreLabel = (score: InsightCardItem["score"]) => {
  return `score ${score.finalScore.toFixed(2)} / confidence ${score.confidence.toFixed(2)}`;
};

const formatDelta = (delta: number) => {
  const abs = Math.abs(delta);
  if (abs <= 1) return `${(abs * 100).toFixed(1)}%`;
  return abs.toFixed(1);
};

const getTrendLabel = (trend?: InsightCardItem["trend"]) => {
  if (!trend) return null;

  const symbol =
    trend.direction === "up"
      ? "↑"
      : trend.direction === "down"
      ? "↓"
      : "→";

  return `${symbol} ${trend.direction} ${formatDelta(trend.delta)}`;
};

const getPrimaryLabel = (isPrimary: boolean) => {
  return isPrimary ? "Top insight" : null;
};

const InsightCard = ({ item, isPrimary = false }: Props) => {
  const trendLabel = getTrendLabel(item.trend);
  const primaryLabel = getPrimaryLabel(isPrimary);

  return (
    <div style={cardStyle(isPrimary)}>
      <div style={metaRowStyle}>
        <span style={{ fontWeight: 700 }}>
          {formatPatternLabel(item.meta.patternType)}
        </span>

        <span style={badgeStyle("default")}>{item.meta.strength}</span>
        <span style={badgeStyle("default")}>{getScoreLabel(item.score)}</span>

        {primaryLabel ? (
          <span style={badgeStyle("primary")}>{primaryLabel}</span>
        ) : null}

        {trendLabel ? (
          <span style={badgeStyle("trend")}>{trendLabel}</span>
        ) : null}
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
          <div style={{ marginTop: 12 }}>
            <span style={sectionLabelStyle}>Next steps</span>

            <div style={{ display: "grid", gap: 8, marginTop: 4 }}>
              {item.actions.map((action, index) => (
                <div
                  key={`${action.title}-${index}`}
                  style={actionBlockStyle}
                >
                  <div style={actionMetaRowStyle}>
                    <strong>{action.title}</strong>
                    <span style={priorityBadgeStyle(action.priority)}>
                      {action.priority}
                    </span>
                  </div>

                  {action.description ? (
                    <div style={{ opacity: 0.8 }}>{action.description}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InsightCard;