// src/lib/csv/pipeline.ts
import { buildHeaderIndexMap, validateRequired } from './validateColumns';
import { toApplicationRecords } from './toRecords';
import { ApplicationRecord } from '@/types/ApplicationRecord';

export type CsvPipelineErrorCode =
  | 'MISSING_REQUIRED_COLUMNS'
  | 'EMPTY_FILE'
  | 'NO_DATA_ROWS';

export type CsvPipelineError = {
  ok: false;
  code: CsvPipelineErrorCode;
  message: string;
  details?: unknown;
};

export type CsvPipelineSuccess = {
  ok: true;
  records: ApplicationRecord[];
  meta: {
    totalRows: number;
    mappedFields: Record<string, number | null>;
  };
};

export type CsvPipelineResult = CsvPipelineSuccess | CsvPipelineError;

export type ParsedCSV = {
  headers: string[];
  rows: string[][];
};

export const runCsvPipeline = (parsed: ParsedCSV): CsvPipelineResult => {
  if (!parsed || !Array.isArray(parsed.headers) || !Array.isArray(parsed.rows)) {
    return {
      ok: false,
      code: 'EMPTY_FILE',
      message: 'CSV parsing result is invalid or empty.',
      details: parsed,
    };
  }

  if (parsed.headers.length === 0) {
    return {
      ok: false,
      code: 'EMPTY_FILE',
      message: 'CSV headers are missing.',
    };
  }

  if (parsed.rows.length === 0) {
    return {
      ok: false,
      code: 'NO_DATA_ROWS',
      message: 'CSV has no data rows.',
    };
  }

  const map = buildHeaderIndexMap(parsed.headers);
  const validation = validateRequired(map);

  if (!validation.ok) {
    return {
      ok: false,
      code: 'MISSING_REQUIRED_COLUMNS',
      message: `Missing required columns: ${validation.missing.join(', ')}`,
      details: { missing: validation.missing, headerIndexMap: map, headers: parsed.headers },
    };
  }

  const records = toApplicationRecords(parsed.rows, map);

  return {
    ok: true,
    records,
    meta: {
      totalRows: parsed.rows.length,
      mappedFields: map,
    },
  };
};
