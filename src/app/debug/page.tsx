import { runCorePatternDebug } from "@/lib/insights/_debug_corePatterns";

export default function DebugPage() {
  runCorePatternDebug();

  return <div>Debug Page</div>;
}