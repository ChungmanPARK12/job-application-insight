// src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { parseCsvText } from "@/domains/processA/parsers/csv";

import { runCsvPipeline } from "@/lib/csv/pipeline";
import type { ApplicationRecord } from "@/types/ApplicationRecord";

// stats
import { buildStatsResult } from "@/lib/stats";

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

  // ✅ pipeline results state
  const [records, setRecords] = useState<ApplicationRecord[] | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept CSV only (best-effort)
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setState({ status: "error", message: "Please upload a .csv file." });
      return;
    }

    // reset previous results when a new file is selected
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
      // Allow re-uploading the same file by resetting the input value
      e.target.value = "";
    }
  };

  const preview = useMemo(() => {
    if (state.status !== "loaded") return null;

    const parsed = parseCsvText(state.text);

    // run pipeline
    const result = runCsvPipeline(parsed);

    if (!result.ok) {
      // Keep preview visible, but show pipeline error and no records
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

  // ✅ Week 3: StatsResult (computed only when records change)
  const stats = useMemo(() => {
    if (!records || records.length === 0) return null;
    return buildStatsResult(records);
  }, [records]);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Job Application Insight System</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Week 3 — Insight Engine: Build numerical foundations (stats) before insight narration.
      </p>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>CSV Upload</h2>

        <input type="file" accept=".csv,text/csv" onChange={onSelectFile} />

        {state.status === "loading" && <p>Loading…</p>}

        {state.status === "error" && (
          <p style={{ color: "crimson" }}>
            Error: {state.message}
          </p>
        )}

        {pipelineError && (
          <p style={{ color: "crimson", marginTop: 12 }}>
            Pipeline Error: {pipelineError}
          </p>
        )}

        {preview && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: 0 }}>
              <strong>File:</strong> {preview.fileName}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Chars:</strong> {preview.charCount.toLocaleString()} /{" "}
              <strong>Columns:</strong> {preview.colCount} /{" "}
              <strong>Rows:</strong> {preview.rowCount}
            </p>

            <div style={{ marginTop: 12 }}>
              <strong>Header preview</strong>
              <pre
                style={{
                  padding: 12,
                  background: "#f7f7f7",
                  borderRadius: 8,
                  overflowX: "auto",
                }}
              >
                {preview.headers.join(" | ")}
              </pre>
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>First 5 rows preview</strong>
              <pre
                style={{
                  padding: 12,
                  background: "#f7f7f7",
                  borderRadius: 8,
                  overflowX: "auto",
                }}
              >
                {preview.firstRows.map((r) => r.join(" | ")).join("\n")}
              </pre>
            </div>

            {records && (
              <div style={{ marginTop: 12 }}>
                <strong>ApplicationRecord[] preview (first 3)</strong>
                <pre
                  style={{
                    padding: 12,
                    background: "#f7f7f7",
                    borderRadius: 8,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(records.slice(0, 3), null, 2)}
                </pre>
              </div>
            )}

            {stats && (
              <div style={{ marginTop: 12 }}>
                <strong>StatsResult (Week 3)</strong>
                <pre
                  style={{
                    padding: 12,
                    background: "#f7f7f7",
                    borderRadius: 8,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>

      <section style={{ marginTop: 24, opacity: 0.9 }}>
        <h3>Work status</h3>
        <ul>
          <li>✅ CSV upload + read text</li>
          <li>✅ CSV parsing (rows/columns)</li>
          <li>✅ Header normalization</li>
          <li>✅ Required column validation</li>
          <li>✅ Status normalization (3 states)</li>
          <li>✅ ApplicationRecord[] generation</li>
          <li>✅ Week 3: Overall stats (StatsResult scaffolded + meta)</li>
          <li>✅ Week 3: Category breakdowns (job_source / location / month / position keyword)</li>
          <li>🟡 Week 3: Rule-based pattern detection (sample guard + comparisons)</li>
          <li>⬜ Week 3: Insight narration (cautious phrasing)</li>
        </ul>
      </section>
    </main>
  );
}
