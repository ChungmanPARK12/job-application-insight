// src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { parseCsvText } from "@/domains/processA/parsers/csv";
import { runCsvPipeline } from "@/lib/csv/pipeline";
import type { ApplicationRecord } from "@/types/ApplicationRecord";

// Stats + Insights
import { buildStatsResult } from "@/lib/stats";
import { detectPatterns } from "@/lib/insights/detectPatterns";
import { narrateInsights } from "@/lib/insights/narrateInsights";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; fileName: string; text: string }
  | { status: "error"; message: string };

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file);
  });
};

export default function Home() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [records, setRecords] = useState<ApplicationRecord[] | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setState({ status: "error", message: "Please upload a .csv file." });
      return;
    }

    setRecords(null);
    setPipelineError(null);
    setState({ status: "loading" });

    try {
      const text = await readFileAsText(file);
      setState({ status: "loaded", fileName: file.name, text });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error.";
      setState({ status: "error", message });
    } finally {
      e.target.value = "";
    }
  };

  const preview = useMemo(() => {
    if (state.status !== "loaded") return null;

    const parsed = parseCsvText(state.text);
    const result = runCsvPipeline(parsed);

    if (!result.ok) {
      setPipelineError(result.message);
      setRecords(null);
    } else {
      setPipelineError(null);
      setRecords(result.records);
    }

    return {
      fileName: state.fileName,
      charCount: state.text.length,
      headers: parsed.headers,
      colCount: parsed.headers.length,
      rowCount: parsed.rows.length,
      firstRows: parsed.rows.slice(0, 5),
    };
  }, [state]);

  // 🟢 Stats Engine
  const stats = useMemo(() => {
    if (!records || records.length === 0) return null;
    return buildStatsResult(records);
  }, [records]);

  // 🟢 Rule-based pattern detection
  const patterns = useMemo(() => {
    if (!stats) return [];
    return detectPatterns(stats);
  }, [stats]);

  // 🟢 Insight narration
  const insights = useMemo(() => {
    if (!patterns || patterns.length === 0) return [];
    return narrateInsights(patterns);
  }, [patterns]);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Job Application Insight System</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Week 3 — Insight Engine: From raw data → stats → patterns → narrative insights.
      </p>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>CSV Upload</h2>

        <input type="file" accept=".csv,text/csv" onChange={onSelectFile} />

        {state.status === "loading" && <p>Loading…</p>}

        {state.status === "error" && (
          <p style={{ color: "crimson" }}>Error: {state.message}</p>
        )}

        {pipelineError && (
          <p style={{ color: "crimson", marginTop: 12 }}>
            Pipeline Error: {pipelineError}
          </p>
        )}

        {preview && (
          <div style={{ marginTop: 16 }}>
            <p>
              <strong>File:</strong> {preview.fileName}
            </p>
            <p>
              <strong>Rows:</strong> {preview.rowCount}
            </p>

            {stats && (
              <>
                <h3>StatsResult</h3>
                <pre style={{ background: "#f7f7f7", padding: 12 }}>
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </>
            )}

            {patterns.length > 0 && (
              <>
                <h3>Detected Patterns</h3>
                <pre style={{ background: "#eef6ff", padding: 12 }}>
                  {JSON.stringify(patterns, null, 2)}
                </pre>
              </>
            )}

            {insights.length > 0 && (
              <>
                <h3>Insight Narration</h3>
                <ul>
                  {insights.map((i, idx) => (
                    <li key={idx}>{i.text}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      <section style={{ marginTop: 24, opacity: 0.9 }}>
        <h3>Work status</h3>
        <ul>
          <li>✅ CSV upload + read text</li>
          <li>✅ CSV parsing</li>
          <li>✅ Header normalization</li>
          <li>✅ Required column validation</li>
          <li>✅ Status normalization</li>
          <li>✅ ApplicationRecord generation</li>
          <li>✅ Overall stats</li>
          <li>✅ Category breakdowns (4)</li>
          <li>✅ Rule-based pattern detection</li>
          <li>🟡 Insight narration (basic version implemented)</li>
        </ul>
      </section>
    </main>
  );
}
