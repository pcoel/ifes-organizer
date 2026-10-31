# Tasks: Agenda Acadêmica IFES Campus Serra (MVP)

**Input**: Design documents from `specs/001-academic-agenda/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`) and Constitution from `.specify/memory/constitution.md`.

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/`, `research.md`

**Tests**: Test tasks are included per user request and Constitution Principle I (Test-First & Spec-Driven Development) for core domain logic, storage persistence, and backup JSON validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story increment.

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no blocking dependencies on incomplete tasks)
- **[Story]**: User story identifier (`[US1]`, `[US2]`, `[US3]`) for story-specific phases
- Exact file paths are provided for every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, toolchain configuration, and baseline architecture.

- [x] T001 Initialize Next.js project with TypeScript, App Router (`output: 'export'`), and Tailwind CSS in `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, and `next.config.mjs`
- [x] T002 [P] Configure Vitest with `@testing-library/react` and `jsdom` test environment in `vitest.config.ts` and `tests/setup.ts`
- [x] T003 [P] Configure ESLint and Prettier rules with zero-warning threshold in `.eslintrc.json` and `.prettierrc`
- [x] T004 [P] Setup global CSS styles, typography, and IFES color tokens in `src/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain models, storage abstraction, and base UI components required across user stories.

**⚠️ CRITICAL**: No user story work can begin until this foundational phase is complete.

- [x] T005 Create base domain entities and Zod schemas for `Disciplina`, `Tarefa`, and `Configuracoes` with verbatim constraints (`nome`: min 2 max 100 chars, `cor`: hex `#RRGGBB`, `titulo`: min 3 max 150 chars, `prioridade`: enum `'BAIXA' | 'MEDIA' | 'ALTA'`, `status`: enum `'PENDENTE' | 'CONCLUIDA'`) in `src/domain/models/disciplina.ts`, `src/domain/models/tarefa.ts`, and `src/domain/models/configuracao.ts`
- [x] T006 [P] Create unit tests for domain models and Zod schema validations in `tests/domain/models.test.ts`
- [x] T007 Implement `IStorageAdapter` and `LocalStorageAdapter` with namespace `agenda_ifes_v1_store`, quota error handling, and in-memory fallback in `src/storage/storage-adapter.ts` and `src/storage/storage-keys.ts`
- [x] T008 [P] Create unit tests for `LocalStorageAdapter` verifying state read/write, storage quota errors, and memory fallback in `tests/storage/storage-adapter.test.ts`
- [x] T009 [P] Create reusable accessible UI components (`Button`, `Input`, `Modal` with focus trap, `Badge`) in `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Modal.tsx`, and `src/components/ui/Badge.tsx`
- [x] T010 Implement centralized `AgendaContext` and `useAgenda` hook with reducer for state dispatching and debounced storage synchronization in `src/context/AgendaContext.tsx` and `src/context/useAgenda.ts`
- [x] T011 [P] Create accessible responsive header and container layout in `src/components/layout/Navbar.tsx` and `src/components/layout/Container.tsx`
- [x] T012 Setup Root Layout wrapping the app in `AgendaProvider` with semantic HTML tags in `src/app/layout.tsx`

**Checkpoint**: Foundation ready - User Story implementation can now proceed independently.

---

## Phase 3: User Story 1 - Gestão e Acompanhamento de Tarefas e Prazos (Priority: P1) 🎯 MVP

**Goal**: O estudante consegue criar, listar, ordenar cronologicamente por prazo, marcar conclusão e visualizar alertas visuais de urgência (<24h e atrasadas) para suas tarefas acadêmicas.

**Independent Test**: Criar tarefas com diferentes prazos e prioridades, verificar ordenação cronológica automática, alternar conclusão com 1 clique e filtrar por status (Todas, Pendentes, Concluídas).

### Tests for User Story 1

> **NOTE: Write these tests FIRST and ensure they FAIL before implementing the services**

- [x] T013 [P] [US1] Create unit tests for `task-service.ts` verifying deadline status calculation (`VENCIDA`, `URGENTE`, `NO_PRAZO`), priority sorting, and status filtering in `tests/domain/task-service.test.ts`
- [x] T014 [P] [US1] Create component tests for `TaskCard` verifying status toggle, overdue alert indicator, and keyboard accessibility in `tests/components/TaskCard.test.tsx`

### Implementation for User Story 1

- [x] T015 [US1] Implement pure domain functions for deadline proximity (`calcularStatusVencimento`), priority ordering, and status filtering in `src/domain/services/task-service.ts`
- [x] T016 [P] [US1] Implement urgency badge component displaying deadline warnings (`Vencida`, `Urgente <24h`, `No Prazo`) in `src/components/tasks/UrgencyBadge.tsx`
- [x] T017 [P] [US1] Implement `TaskCard` component with accessible completion checkbox, date formatting via native `Intl`, and edit/delete actions in `src/components/tasks/TaskCard.tsx`
- [x] T018 [US1] Implement `TaskFormModal` for creating and editing tasks with title (min 3 max 150), deadline (`YYYY-MM-DDTHH:mm`), priority, and description in `src/components/tasks/TaskFormModal.tsx`
- [x] T019 [P] [US1] Implement `TaskFilters` bar for filtering by status (Todas, Pendentes, Concluídas), priority level, and search terms in `src/components/tasks/TaskFilters.tsx`
- [x] T020 [US1] Implement main dashboard page assembling task list, filter bar, urgency counters, and empty state in `src/app/page.tsx`

**Checkpoint**: User Story 1 (MVP) is fully functional and independently testable.

---

## Phase 4: User Story 2 - Cadastro e Associação de Disciplinas e Professores (Priority: P2)

**Goal**: O estudante cadastra matérias do IFES Campus Serra (com professor, sala e cor), vincula tarefas a disciplinas, visualiza etiquetas coloridas nas tarefas, filtra por matéria e desassocia tarefas suavemente ao excluir uma disciplina.

**Independent Test**: Cadastrar 2 disciplinas com cores distintas, criar tarefas vinculadas a cada uma, filtrar por disciplina na listagem geral e excluir uma matéria confirmando que suas tarefas permanecem salvas como não vinculadas.

### Tests for User Story 2

- [x] T021 [P] [US2] Create unit tests for discipline domain service verifying name uniqueness and soft unlinking of deleted discipline from tasks in `tests/domain/discipline-service.test.ts`
- [x] T022 [P] [US2] Create component tests for discipline card and modal in `tests/components/DisciplineCard.test.tsx`

### Implementation for User Story 2

- [x] T023 [US2] Implement pure domain functions for discipline validation and soft decoupling of tasks (`desvincularDisciplina`) in `src/domain/services/discipline-service.ts`
- [x] T024 [P] [US2] Implement `DisciplineCard` showing course name, professor, room, task count badge, and color tag in `src/components/disciplines/DisciplineCard.tsx`
- [x] T025 [US2] Implement `DisciplineModal` with form validation (unique course name min 2 max 100, hex color `#RRGGBB`, optional professor and room) in `src/components/disciplines/DisciplineModal.tsx`
- [x] T026 [US2] Create disciplines management view with creation modal, list/grid of subjects, and deletion confirmation in `src/app/disciplinas/page.tsx`
- [x] T027 [US2] Integrate discipline selection dropdown and color tag badge into `src/components/tasks/TaskFormModal.tsx` and `src/components/tasks/TaskCard.tsx`
- [x] T028 [US2] Integrate discipline filter selector into `src/components/tasks/TaskFilters.tsx` and update dashboard view in `src/app/page.tsx`

**Checkpoint**: User Stories 1 and 2 work independently and integrate seamlessly.

---

## Phase 5: User Story 3 - Persistência Local e Backup / Restauração de Dados (Priority: P3)

**Goal**: O estudante exporta backup completo estruturado em JSON com timestamp e restaura dados em qualquer dispositivo com validação estrita de esquema Zod, modal de confirmação e salvaguarda contra arquivos corrompidos.

**Independent Test**: Exportar arquivo JSON com tarefas e disciplinas existentes, limpar os dados do navegador, importar o backup e verificar restauração integral; tentar importar JSON inválido e verificar rejeição segura sem corrupção.

### Tests for User Story 3

- [x] T029 [P] [US3] Create unit tests for backup serialization and Zod validation (`validarPacoteBackup`, schema version `1`, rejection of malformed payloads) in `tests/domain/backup-service.test.ts`
- [x] T030 [P] [US3] Create component tests for backup export trigger and file upload confirmation modal in `tests/components/BackupSection.test.tsx`

### Implementation for User Story 3

- [x] T031 [US3] Implement `PacoteBackup` Zod schema and pure serialization/validation functions (`validarPacoteBackup`, `gerarPacoteBackup`) in `src/domain/services/backup-service.ts` and `src/domain/models/backup.ts`
- [x] T032 [P] [US3] Implement `ExportCard` with one-click JSON blob creation and timestamped download trigger (`agenda-ifes-backup-YYYY-MM-DD-HHmm.json`) in `src/components/backup/ExportCard.tsx`
- [x] T033 [US3] Implement `ImportCard` with file reader, schema validation summary, preview of items to restore, and overwrite confirmation modal in `src/components/backup/ImportCard.tsx`
- [x] T034 [US3] Create backup and data management page assembling export and import cards in `src/app/backup/page.tsx`
- [x] T035 [US3] Integrate storage status banner and data corruption warning in `src/components/layout/Navbar.tsx`

**Checkpoint**: All three user stories are complete, independently functional, and verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Acessibilidade WCAG 2.1 AA / eMAG, dados de exemplo para novos estudantes e validação global.

- [x] T036 [P] Conduct accessibility audit (keyboard navigation, focus management, ARIA labels, color contrast) across all views in `src/app/`
- [x] T037 [P] Create initial welcome seed data for first-time students (e.g. IFES welcome task and sample course) in `src/domain/services/seed-data.ts`
- [x] T038 Execute full end-to-end validation scenarios documented in `specs/001-academic-agenda/quickstart.md`
- [x] T039 [P] Run static verification pipeline (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`) and ensure zero errors or warnings in `package.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS** all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - Can proceed sequentially in priority order (`P1` → `P2` → `P3`) or in parallel by feature branch.
- **Polish (Phase 6)**: Depends on User Stories 1, 2, and 3 completion.

### User Story Dependencies

- **User Story 1 (P1 - Tarefas)**: Depends only on Foundational (Phase 2). Delivers standalone MVP.
- **User Story 2 (P2 - Disciplinas)**: Depends on Foundational (Phase 2). Enriches US1 with course tags, but US1 remains fully functional without it.
- **User Story 3 (P3 - Backup)**: Depends on Foundational (Phase 2) and imports/exports types from US1 and US2 models.

### Parallel Opportunities

- In Phase 1: T002, T003, T004 can run in parallel.
- In Phase 2: T006, T008, T009, T011 can run in parallel after their corresponding models/adapters are defined.
- In Phase 3 (US1): Tests T013, T014 can be written in parallel; T016, T017, T019 can run in parallel.
- In Phase 4 (US2): T021, T022, T024 can run in parallel.
- In Phase 5 (US3): T029, T030, T032 can run in parallel.
- In Phase 6: T036, T037, T039 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch test creation tasks in parallel:
Task: "Create unit tests for task-service.ts in tests/domain/task-service.test.ts"
Task: "Create component tests for TaskCard in tests/components/TaskCard.test.tsx"

# Launch UI components in parallel after domain service is complete:
Task: "Implement UrgencyBadge in src/components/tasks/UrgencyBadge.tsx"
Task: "Implement TaskCard in src/components/tasks/TaskCard.tsx"
Task: "Implement TaskFilters in src/components/tasks/TaskFilters.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`T001` - `T004`)
2. Complete Phase 2: Foundational (`T005` - `T012`)
3. Complete Phase 3: User Story 1 (`T013` - `T020`)
4. **STOP and VALIDATE**: Verify User Story 1 independently against scenarios in `spec.md`. The student already has a working task manager!

### Incremental Delivery

1. Setup + Foundational → Solid local-first architecture ready.
2. User Story 1 → Tasks, deadlines, priorities and urgency alerts functional (**MVP**).
3. User Story 2 → Academic courses and professors linked to tasks.
4. User Story 3 → Full JSON backup import/export and storage recovery.
5. Polish → Accessibility verification, seed data, build and final quality gates.
