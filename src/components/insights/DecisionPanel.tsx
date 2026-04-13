import type { DecisionPanelData } from "@/lib/insights/types/decisionPanel.types";
import {
  formatPatternType,
  formatOutcomeDirection,
  formatConfidenceLabel,
} from "@/lib/insights/formatters/decisionFormatter";

type DecisionPanelProps = {
  data: DecisionPanelData | null;
};

export const DecisionPanel = ({ data }: DecisionPanelProps) => {
  if (!data) {
    return (
      <section>
        <h2>Decision</h2>
        <p>No decision is available yet.</p>
      </section>
    );
  }

  const formattedDirection = formatOutcomeDirection(data.outcome.direction);

  return (
    <section>
      <h2>Decision</h2>

      <div>
        <h3>Primary Decision</h3>
        <p>{data.primaryDecision.message}</p>
      </div>

      <div>
        <h3>Why this matters</h3>
        <p>{data.why.summary}</p>

        {data.why.supportingSignals.length > 0 && (
          <ul>
            {data.why.supportingSignals.map((signal, index) => (
              <li key={`${signal.type}-${index}`}>
                {formatPatternType(signal.type)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>What to do</h3>

        {data.action.steps.length > 0 ? (
          <ol>
            {data.action.steps.map((step) => (
              <li key={step.step}>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p>No execution steps are available.</p>
        )}
      </div>

      <div>
        <h3>Expected outcome</h3>
        <p>{data.outcome.summary}</p>

        {data.outcome.improvement && (
          <p>
            <strong>Estimated impact:</strong> {data.outcome.improvement}
          </p>
        )}

        {formattedDirection && <p>{formattedDirection}</p>}
      </div>

      <div>
        <h3>Confidence</h3>
        <p>{formatConfidenceLabel(data.confidence.label)}</p>

        {data.confidence.reasoning && <p>{data.confidence.reasoning}</p>}
      </div>
    </section>
  );
};
