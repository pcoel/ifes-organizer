# Research & Technical Decisions: AgendaIFES MVP

**Feature**: `001-academic-agenda`  
**Date**: 2026-10-31  
**Status**: Completed  

---

### 1. Application Architecture & Rendering Model

- **Decision**: Next.js (App Router) configured for Static Export (`output: 'export'`), using client components (`"use client"`) for interactive views.
- **Rationale**: 
  - Strictly adheres to Constitution Principle II (Local-First & Client-Side Architecture) and the zero-backend requirement.
  - Generates standalone static HTML/CSS/JS assets that run entirely in the user's browser, eliminating hosting/server costs and enabling zero-latency navigation.
  - Ensures seamless offline capability and paves the path for Progressive Web App (PWA) service worker integration in future evolutions.
- **Alternatives Considered**:
  - *Pure Vite + React SPA*: Extremely fast build times, but Next.js was explicitly mandated by the ratified project constitution (Section 2: Technology Stack & Architectural Constraints).
  - *Next.js with Node Server & API Routes*: Violates the requirement of a local-only, zero-server MVP without user accounts or remote database.

---

### 2. Client-Side Persistence & Storage Strategy

- **Decision**: Dedicated `StorageAdapter` interface encapsulating `window.localStorage` with namespace prefixing (`agenda_ifes_v1_*`), versioning, and an in-memory fallback for environments where storage access is restricted (e.g., privacy/incognito modes).
- **Rationale**:
  - Encapsulates all persistence mechanisms behind a clean repository/adapter interface, adhering to Principle II (isolation of UI, domain logic, and storage).
  - Standard `localStorage` is synchronously accessible, universally supported across all mobile and desktop browsers, and provides ~5MB of storage—sufficient for thousands of academic tasks and disciplines.
  - Allows swapping the internal implementation to IndexedDB or OPFS in the future without altering business logic or React components.
- **Alternatives Considered**:
  - *IndexedDB directly*: Provides asynchronous operations and higher capacity, but introduces unnecessary asynchronous ceremony and complex cursor APIs for an MVP dataset that easily fits in memory.
  - *SQLite in WebAssembly*: Adds >1.5MB of binary overhead and complex setup; rejected as premature complexity (violates Principle IV - YAGNI).

---

### 3. Backup, Export / Import & Schema Validation

- **Decision**: Strict runtime schema validation using `Zod` for JSON import/export, with an explicit `schemaVersion: 1` envelope, metadata timestamps, and transactional (fail-fast) imports.
- **Rationale**:
  - Adheres directly to Constitution Principle III (Type Safety & Data Integrity).
  - Prevents malformed, outdated, or hostile JSON payloads from corrupting local student records.
  - Client-side export triggers an immediate file download using `Blob` and `URL.createObjectURL` with naming convention `agenda-ifes-backup-YYYY-MM-DD-HHmm.json`.
- **Alternatives Considered**:
  - *Manual JavaScript checking (`typeof`, `in`)*: Fragile, highly error-prone, and lacks static type inference.
  - *JSON Schema (AJV)*: Requires additional compilation pipelines; Zod provides idiomatic TypeScript integration and inferable types with minimal bundle impact.

---

### 4. State Management & React Architecture

- **Decision**: Centralized React Context (`AgendaContext`) paired with a domain reducer (`useReducer`) and custom hook (`useAgenda`).
- **Rationale**:
  - Satisfies all MVP needs without external state management libraries, keeping the bundle lean and adhering to Principle IV (Simplicity & Scope Discipline).
  - Centralizes domain events (`ADD_TASK`, `TOGGLE_TASK`, `DELETE_TASK`, `ADD_DISCIPLINE`, `IMPORT_BACKUP`), ensuring state changes automatically sync to the storage adapter with debounced writes.
  - Easily mockable in unit and component integration tests.
- **Alternatives Considered**:
  - *Redux Toolkit*: Significant boilerplate and unnecessary cognitive overhead for an individual client-side app.
  - *Zustand*: Capable and lightweight, but adds an external dependency when native React Context + Reducer is fully adequate for the MVP scope.

---

### 5. Testing Framework & Verification Approach

- **Decision**: `Vitest` with `@testing-library/react` and `jsdom` for unit and integration testing.
- **Rationale**:
  - Vitest provides instantaneous test execution, native TypeScript and ESM resolution, and full compatibility with modern React/Next.js toolchains.
  - Enables test-first development (TDD) for pure domain functions (deadline proximity calculations, priority filtering, sorting, backup verification) and component interaction tests without needing a running browser or server.
- **Alternatives Considered**:
  - *Jest*: Slower cold starts, complex ESM and TypeScript transformation configurations.
  - *Playwright/Cypress for unit testing*: Heavyweight; better suited for future end-to-end regression pipelines once UI stabilizes.

---

### 6. Design System, Accessibility & Localization

- **Decision**: Tailwind CSS utility classes adhering to WCAG 2.1 AA / eMAG guidelines, semantic HTML5 elements (`main`, `nav`, `section`, `article`, `header`), ARIA live regions for urgent alerts, and native `Intl.DateTimeFormat` for Brazilian Portuguese (`pt-BR`).
- **Rationale**:
  - Ensures compliance with Constitution Principle V (Accessibility, Responsiveness & Privacy by Design).
  - Native browser `Intl` handles Brazilian date/time formatting without adding bloated date libraries like `moment.js`.
  - Mobile-first CSS ensures an optimal experience on student smartphones as well as desktop campus lab computers.
- **Alternatives Considered**:
  - *Component UI Libraries (MUI, Chakra, AntD)*: Introduce large JavaScript footprints and rigid styling paradigms that complicate custom IFES visual identity.
  - *Moment.js / Date-fns*: Moment is deprecated and heavy; native JavaScript `Intl` and `Date` APIs meet all MVP formatting requirements cleanly.
