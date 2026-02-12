"use client";

import React, { useMemo, useState } from "react";

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

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept CSV only (best-effort)
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setState({ status: "error", message: "Please upload a .csv file." });
      return;
    }

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

    const lines = state.text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const header = lines[0] ?? "";
    const rowCount = Math.max(0, lines.length - 1);

    return {
      fileName: state.fileName,
      charCount: state.text.length,
      lineCount: lines.length,
      rowCount,
      header,
    };
  }, [state]);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Job Application Insight System</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Week 2 — Data Ready: Upload CSV and read it as data.
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

        {preview && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: 0 }}>
              <strong>File:</strong> {preview.fileName}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Chars:</strong> {preview.charCount.toLocaleString()} /{" "}
              <strong>Lines:</strong> {preview.lineCount.toLocaleString()} /{" "}
              <strong>Rows:</strong> {preview.rowCount.toLocaleString()}
            </p>

            <div style={{ marginTop: 12 }}>
              <strong>Header preview</strong>
              <pre style={{ padding: 12, background: "#f7f7f7", borderRadius: 8, overflowX: "auto" }}>
                {preview.header}
              </pre>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginTop: 24, opacity: 0.8 }}>
        <h3>Next steps</h3>
        <ul>
          <li>Day 2: CSV parsing (rows/columns)</li>
          <li>Day 3: Header normalization + mapping to ApplicationRow</li>
          <li>Day 4: Validation (required columns)</li>
          <li>Day 5: Basic stats</li>
        </ul>
      </section>
    </main>
  );
}
