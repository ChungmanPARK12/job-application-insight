// src/components/insights/InsightPanel.tsx

import InsightCard from "./InsightCard";

type NarrativeItem = {
  pattern_type: string;
  strength: string;
  fact: string;
  boundary: string;
  reflection?: string;
};

type Props = {
  narratives: NarrativeItem[];
  maxItems?: number;
};

const InsightPanel = ({ narratives, maxItems = 2 }: Props) => {
  if (!narratives.length) {
    return <div style={{ opacity: 0.75 }}>No prioritized insights detected yet.</div>;
  }

  const displayItems = narratives.slice(0, maxItems);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {displayItems.map((item, idx) => (
        <InsightCard key={`${item.pattern_type}-${idx}`} item={item} />
      ))}
    </div>
  );
};

export default InsightPanel;