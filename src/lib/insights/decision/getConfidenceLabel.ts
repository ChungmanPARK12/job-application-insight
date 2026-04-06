export const getConfidenceLabel = (
  confidence: number,
): "High" | "Medium" | "Low" => {
  if (confidence >= 0.75) return "High";
  if (confidence >= 0.5) return "Medium";
  return "Low";
};
