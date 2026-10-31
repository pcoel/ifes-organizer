<!--
SYNC IMPACT REPORT
==================
- Version change: Unversioned Template -> 1.0.0 (Initial Ratification)
- Core Principles defined:
  * I. Spec-Driven Development & Acceptance Criteria (New)
  * II. Local-First & Client-Side Architecture (New)
  * III. Type Safety & Data Integrity (New)
  * IV. Simplicity & Scope Discipline (New)
  * V. Accessibility, Responsiveness & Privacy by Design (New)
- Added sections:
  * Technology Stack & Architectural Constraints
  * Quality Gates & Development Workflow
  * Governance
- Removed sections:
  * Generic placeholder comments and template tokens
- Follow-up TODOs:
  * None
-->

# AgendaIFES Constitution

## Core Principles

### I. Spec-Driven Development & Acceptance Criteria
Every feature MUST begin with a formal specification (`spec.md`) and verifiable acceptance criteria before implementation. Implementation tasks MUST NOT commence without prior alignment on scope and user flows. Automated and manual verification MUST confirm all acceptance scenarios before a feature is marked complete.
*Rationale*: Preempts scope creep, prevents rework, and guarantees that software directly fulfills real academic needs of IFES Campus Serra students without unnecessary complexity.

### II. Local-First & Client-Side Architecture
The initial release (MVP) MUST operate completely client-side, requiring no remote backend, external database, or authentication server. All academic entities (disciplines, professors, tasks, deadlines, priorities) MUST be persisted in the browser via `localStorage`. The codebase MUST maintain strict separation of concerns among UI components, domain/business logic, and storage adapters. The system MUST provide reliable JSON import and export capabilities to allow complete student data backup and restoration.
*Rationale*: Eliminates server maintenance overhead, delivers zero-latency user experiences, works reliably in varying campus network conditions, and grants students absolute ownership and privacy over their academic data.

### III. Type Safety & Data Integrity
All application logic MUST be implemented in strict TypeScript with no unvalidated `any` types. All incoming data structures—specifically `localStorage` state and imported JSON backup files—MUST be validated at runtime against strict schemas (e.g., Zod) before being processed or persisted. The system MUST handle malformed or legacy data gracefully with user-friendly recovery prompts, preventing crashes or state corruption.
*Rationale*: Client-side persistence and JSON file exchanges are susceptible to corruption and schema evolution; rigorous validation safeguards student records against accidental loss.

### IV. Simplicity & Scope Discipline (YAGNI)
The project MUST adhere strictly to YAGNI (You Aren't Gonna Need It) and simplicity principles. Developers MUST NOT introduce speculative abstractions, unnecessary third-party libraries, premature backend integration hooks, or features not explicitly requested in the specification. Component design MUST prioritize clarity and reusability over clever or deeply nested abstractions.
*Rationale*: A tightly scoped and clean codebase ensures rapid iterations, easy onboarding for student contributors, and high reliability for the MVP.

### V. Accessibility, Responsiveness & Privacy by Design
The user interface MUST be responsive and provide an ergonomic experience across mobile phones, tablets, and desktop computers. User interfaces MUST conform to WCAG 2.1 AA and Brazilian digital government accessibility standards (eMAG), ensuring high contrast, clear typography, and full keyboard navigability. Student data privacy is absolute: zero student data may be tracked or exfiltrated, and no credentials or secrets shall ever be introduced into the repository.
*Rationale*: IFES students access the agenda from diverse environments (personal smartphones, campus computer labs, laptops); universal accessibility and non-negotiable privacy are prerequisites for wide adoption.

## Technology Stack & Architectural Constraints

- **Framework & Language**: Next.js (App Router), React, and TypeScript configured with strict compiler checks.
- **Styling & UI**: Tailwind CSS for responsive, accessible, utility-first styling and theme consistency.
- **Storage Layer**: Dedicated Storage Service Adapter isolating all `localStorage` reads/writes, schema versioning, and JSON serialization.
- **Domain Logic Separation**: Pure business logic (e.g., deadline proximity, academic calendar calculations, priority sorting) MUST remain independent of React UI components.
- **Evolutionary Path**: Architecture MUST keep client-side concerns decoupled so future enhancements (such as PWA service workers and offline caching) can be introduced without redesigning domain models.

## Quality Gates & Development Workflow

- **Specification Verification**: No code changes shall be merged without prior alignment with approved requirements in `.specify/`.
- **Code Quality & Linting**: ESLint and Prettier rules MUST execute with zero errors or warnings before committing.
- **Testing Requirements**: Core domain functions, schema validation (Zod models), and data import/export converters MUST have automated unit tests.
- **Documentation**: All major architectural decisions (ADRs) and data schema updates MUST be documented in markdown within the repository.

## Governance

This constitution represents the supreme engineering authority for AgendaIFES and supersedes conflicting informal practices. Any amendments to principles, architecture, or governance rules require updating this document and bumping its semantic version:
- **MAJOR**: Incompatible principle removals or major architectural shifts (e.g., introducing mandatory backend servers or cloud authentication).
- **MINOR**: Adding new principles, adopting new core architectural layers (e.g., PWA offline sync), or substantial governance expansions.
- **PATCH**: Clarifications, wording improvements, non-semantic refinements, or typo fixes.

All pull requests, automated agent tasks, and contributor reviews MUST verify compliance against the principles defined herein.

**Version**: 1.0.0 | **Ratified**: 2026-10-31 | **Last Amended**: 2026-10-31
