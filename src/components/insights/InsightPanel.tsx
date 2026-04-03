// src/components/insights/InsightPanel.tsx
import type { InsightCard as InsightCardItem } from "@/lib/insights/types/insightCard.types";
import InsightCard from "./InsightCard";

type Props = {
  cards: InsightCardItem[];
  maxItems?: number;
};

const sortCards = (cards: InsightCardItem[]) => {
  return [...cards].sort((a, b) => {
    const scoreDiff = b.score.finalScore - a.score.finalScore;
    if (scoreDiff !== 0) return scoreDiff;

    const confidenceDiff = b.score.confidence - a.score.confidence;
    if (confidenceDiff !== 0) return confidenceDiff;

    return a.meta.patternType.localeCompare(b.meta.patternType);
  });
};

const InsightPanel = ({ cards, maxItems = 2 }: Props) => {
  if (!cards.length) {
    return (
      <div style={{ opacity: 0.75 }}>
        No prioritized insights detected yet.
      </div>
    );
  }

  const displayItems = sortCards(cards).slice(0, maxItems);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {displayItems.map((item, idx) => (
        <InsightCard
          key={`${item.meta.patternType}-${item.meta.strength}-${idx}`}
          item={item}
          isPrimary={idx === 0}
        />
      ))}
    </div>
  );
};

export default InsightPanel;