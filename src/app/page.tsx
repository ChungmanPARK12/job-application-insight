// src/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { parseCsvText } from "@/domains/processA/parsers/csv";
import { runInsightPipeline } from "@/lib/insights/runInsightsPipeline";

// ---------- local types ----------
type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; fileName: string; text: string }
  | { status: "error"; message: string };

type BreakdownRow = {
  label: string;
  count?: number;
  interviewRate?: number;
};

// ---------- file reader ----------
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file);
  });
};

// ---------- UI helpers ----------
const shell: React.CSSProperties = {
  padding: 24,
  maxWidth: 980,
  margin: "0 auto",
};

const Card = ({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <section
      style={{
        padding: 16,
        border: "1px solid #e6e6e6",
        borderRadius: 12,
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
          {subtitle ? (
            <p style={{ margin: "6px 0 0 0", opacity: 0.75, lineHeight: 1.4 }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
};

const StatPill = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 999,
        padding: "8px 12px",
        display: "inline-flex",
        gap: 8,
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <span style={{ opacity: 0.7, fontSize: 13 }}>{label}</span>
      <strong style={{ fontSize: 13 }}>{value}</strong>
    </div>
  );
};

const formatPct = (v: unknown) => {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  const p = v <= 1 ? v * 100 : v;
  return `${p.toFixed(1)}%`;
};

const pickFirstNumber = (...vals: unknown[]) => {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return null;
};

const pickFirstObject = (...vals: unknown[]) => {
  for (const v of vals) {
    if (v && typeof v === "object") return v as Record<string, unknown>;
  }
  return null;
};

const BreakdownCard = ({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: BreakdownRow[];
}) => {
  const top = rows
    .slice()
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 3);

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 14,
        background: "#fff",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        {subtitle ? (
          <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>{subtitle}</div>
        ) : null}
      </div>

      {top.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 13 }}>No data available.</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
          {top.map((r) => {
            const pct = formatPct(r.interviewRate);
            return (
              <li key={r.label}>
                <strong>{r.label}</strong>
                {typeof r.count === "number" ? (
                  <span style={{ opacity: 0.8 }}> — {r.count}</span>
                ) : null}
                {pct ? (
                  <span style={{ opacity: 0.8 }}> • interview rate {pct}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ---------- page ----------
export default function Home() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [debug, setDebug] = useState(false);

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      e.target.value = "";
    }
  };

  // 1) Parse + full insight pipeline
  const pipeline = useMemo(() => {
    if (state.status !== "loaded") return null;

    const parsed = parseCsvText(state.text);
    const result = runInsightPipeline(parsed);

    return {
      fileName: state.fileName,
      charCount: state.text.length,
      headers: parsed.headers,
      rowCount: parsed.rows.length,
      result,
    };
  }, [state]);

  // 2) Derived pipeline result slices
  const records = useMemo(() => {
    if (!pipeline?.result.ok) return null;
    return pipeline.result.records;
  }, [pipeline]);

  const pipelineError = useMemo(() => {
    if (!pipeline) return null;
    if (pipeline.result.ok) return null;
    return pipeline.result.message;
  }, [pipeline]);

  const stats = useMemo(() => {
    if (!pipeline?.result.ok) return null;
    return pipeline.result.stats;
  }, [pipeline]);

  const patterns = useMemo(() => {
    if (!pipeline?.result.ok) return [];
    return pipeline.result.patterns;
  }, [pipeline]);

  const narratives = useMemo(() => {
    if (!pipeline?.result.ok) return [];
    return pipeline.result.narratives;
  }, [pipeline]);

  // ----- Presentation extraction (best-effort, guardrail safe) -----
  const overall = useMemo(() => {
    if (!stats) return null;
    const s: any = stats;

    const overallObj = s.overall ?? s.summary ?? s.totals ?? null;

    const total =
      pickFirstNumber(
        overallObj?.total,
        overallObj?.applications,
        overallObj?.totalApplications,
        s.total
      ) ?? (records?.length ?? null);

    const interviewRate =
      pickFirstNumber(
        overallObj?.interviewRate,
        overallObj?.interview_rate,
        overallObj?.rate
      ) ?? null;

    const statusCounts =
      pickFirstObject(
        overallObj?.by_status,
        overallObj?.statusCounts,
        overallObj?.status_counts,
        overallObj?.statuses
      ) ??
      pickFirstObject(s.by_status, s.statusCounts, s.status_counts) ??
      null;

    return { total, interviewRate, statusCounts, overallObj };
  }, [stats, records?.length]);

  // breakdowns is an ARRAY of { dimension, rows }
  const breakdowns = useMemo(() => {
    if (!stats) return null;
    const s: any = stats;

    if (!Array.isArray(s.breakdowns)) return null;

    const findRows = (dimension: string) =>
      (s.breakdowns.find((b: any) => b?.dimension === dimension)?.rows ?? []) as any[];

    const mapRows = (rows: any[]): BreakdownRow[] =>
      rows.map((r) => ({
        label: String(r?.key ?? "Unknown"),
        count: typeof r?.total === "number" ? r.total : undefined,
        interviewRate:
          typeof r?.interview_rate === "number" ? r.interview_rate : undefined,
      }));

    return {
      job_source: mapRows(findRows("job_source")),
      location: mapRows(findRows("location")),
      month: mapRows(findRows("month")),
      position_keyword: mapRows(findRows("position_keyword")),
    };
  }, [stats]);

  const hasData = state.status === "loaded" && (pipeline?.rowCount ?? 0) > 0;

  return (
    <main style={shell}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ marginBottom: 6 }}>Job Application Insight System</h1>
        <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
          Productization Layer (Week 3) — CSV upload, insight pipeline, and
          presentation cards for non-technical viewers.
        </p>
      </header>

      <Card
        title="CSV Upload"
        subtitle="Upload a .csv file. The system will validate headers, normalize statuses, compute stats, detect patterns, and generate prioritized insight narratives."
        right={
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
            />
            <span style={{ fontSize: 13, opacity: 0.8 }}>Show debug</span>
          </label>
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <input type="file" accept=".csv,text/csv" onChange={onSelectFile} />

          {state.status === "loading" ? <span style={{ opacity: 0.8 }}>Loading…</span> : null}
          {state.status === "error" ? (
            <span style={{ color: "crimson" }}>Error: {state.message}</span>
          ) : null}
          {pipelineError ? (
            <span style={{ color: "crimson" }}>Pipeline Error: {pipelineError}</span>
          ) : null}
        </div>

        {pipeline && pipeline.result.ok ? (
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatPill label="File" value={pipeline.fileName} />
            <StatPill label="Rows" value={pipeline.rowCount} />
            <StatPill label="Columns" value={pipeline.headers.length} />
          </div>
        ) : null}

        {debug && pipeline ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>
              Debug (developer-only)
            </div>
            <pre
              style={{
                background: "#f7f7f7",
                padding: 12,
                borderRadius: 12,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(
                {
                  preview: {
                    fileName: pipeline.fileName,
                    charCount: pipeline.charCount,
                    headers: pipeline.headers,
                    rowCount: pipeline.rowCount,
                  },
                  stats,
                  patterns,
                  narratives,
                },
                null,
                2
              )}
            </pre>
          </div>
        ) : null}
      </Card>

      {hasData ? (
        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          <Card
            title="Overall Summary"
            subtitle="High-level metrics. Insights are phrased cautiously and may be limited by sample size."
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <StatPill label="Applications" value={overall?.total ?? "—"} />
              <StatPill
                label="Interview rate"
                value={
                  overall?.interviewRate != null
                    ? formatPct(overall.interviewRate) ?? "—"
                    : "—"
                }
              />
            </div>

            {overall?.statusCounts ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Status distribution</div>
                <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                  {Object.entries(overall.statusCounts).map(([k, v]) => (
                    <li key={k}>
                      <strong>{k}</strong>: {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
                Status distribution is not available in the current stats output.
              </div>
            )}
          </Card>

          <Card
            title="Key Insights"
            subtitle="Prioritized reflection narratives. These are descriptive signals, not deterministic conclusions."
          >
            {narratives.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No prioritized insights detected yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {narratives.map((n, idx) => (
                  <div
                    key={idx}
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
                      <span style={{ fontWeight: 700 }}>{n.pattern_type}</span>
                      <span
                        style={{
                          fontSize: 12,
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "#f5f5f5",
                          border: "1px solid #eaeaea",
                        }}
                      >
                        {n.strength}
                      </span>
                    </div>

                    <div style={{ lineHeight: 1.65 }}>
                      <div>
                        <strong>Fact:</strong> {n.fact}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <strong>Boundary:</strong> {n.boundary}
                      </div>
                      {n.reflection ? (
                        <div style={{ marginTop: 6 }}>
                          <strong>Reflection:</strong> {n.reflection}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Breakdown Summary"
            subtitle="Top buckets only (to keep it readable). Small samples may weaken reliability."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <BreakdownCard
                title="Job source"
                subtitle="Top 3 sources"
                rows={breakdowns?.job_source ?? []}
              />
              <BreakdownCard
                title="Location"
                subtitle="Top 3 locations"
                rows={breakdowns?.location ?? []}
              />
              <BreakdownCard title="Month" subtitle="Top 3 months" rows={breakdowns?.month ?? []} />
              <BreakdownCard
                title="Position keyword"
                subtitle="Top 3 keywords"
                rows={breakdowns?.position_keyword ?? []}
              />
            </div>

            {!breakdowns ? (
              <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
                Breakdown blocks are not available in the current stats output shape.
              </div>
            ) : null}
          </Card>
        </div>
      ) : null}

      <footer style={{ marginTop: 22, opacity: 0.7, fontSize: 13, lineHeight: 1.5 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Work status</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Week 3 pipeline integrated (CSV → stats → insight engine)</li>
          <li>Insight narratives connected to the presentation layer</li>
        </ul>
      </footer>
    </main>
  );
}