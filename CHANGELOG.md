# CHANGELOG

## [2026-02-05] — Project Initialization

### Create Project
- Initialized Next.js project with TypeScript
- Command used:
  - `npx create-next-app@latest job-application-insight --typescript`
- Verified local development server (`npm run dev`)

### Tooling & Configuration
- ESLint configured (Next.js default)
- TypeScript + React standard linting
- Codebase structured under `src/` directory
- Import alias enabled (`@/`)

## [2026-02-12] — Week 2 Day 1

### CSV Upload (Preview Stage)
- Implemented CSV file upload in UI
- Read file content using FileReader
- Displayed file metadata (chars, lines, rows)
- Added header preview

## [2026-02-13] — Week 2: Data Stabilization Layer

### Added
- Header, internal field mapping (`HEADER_ALIASES`)
- Status normalization (3 states only):
  - No response
  - Rejected
  - Interview
- Required column validation
- `ApplicationRecord` model (UUID-based `application_id`)
- Unified CSV pipeline:
  - parse → mapping → validation → normalization → records

### Updated
- Integrated pipeline into `page.tsx`
- Added `records` and `pipelineError` state
- Added ApplicationRecord preview block

Next:
- Basic statistics calculation (interview conversion metrics)



