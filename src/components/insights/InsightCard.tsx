// src/components/insights/InsightCard.tsx
type NarrativeItem = {
  pattern_type: string;
  strength: string;
  fact: string;
  boundary: string;
  reflection?: string;
};

type Props = {
  item: NarrativeItem;
};

const InsightCard = ({ item }: Props) => {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 14,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontWeight: 700 }}>{item.pattern_type}</span>
        <span
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 999,
            background: "#f5f5f5",
            border: "1px solid #eaeaea",
          }}
        >
          {item.strength}
        </span>
      </div>

      <div style={{ lineHeight: 1.65 }}>
        <div>
          <strong>Fact:</strong> {item.fact}
        </div>
        <div style={{ marginTop: 6 }}>
          <strong>Boundary:</strong> {item.boundary}
        </div>
        {item.reflection ? (
          <div style={{ marginTop: 6 }}>
            <strong>Reflection:</strong> {item.reflection}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InsightCard;