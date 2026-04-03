// src/components/insights/InsightPanel.tsx
import type { InsightCard as InsightCardItem } from "@/lib/insights/types/insightCard.types";
import InsightCard from "./InsightCard";

type Props = {
  cards: InsightCardItem[];
  maxItems?: number;
};

const InsightPanel = ({ cards, maxItems = 2 }: Props) => {
  if (!cards.length) {
    return (
      <div style={{ opacity: 0.75 }}>
        No prioritized insights detected yet.
      </div>
    );
  }

  const displayItems = cards.slice(0, maxItems);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {displayItems.map((item, idx) => (
        <InsightCard
          key={`${item.meta.patternType}-${item.meta.strength}-${idx}`}
          item={item}
        />
      ))}
    </div>
  );
};

export default InsightPanel;