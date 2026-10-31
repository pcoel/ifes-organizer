# Implementation Plan: Agenda Acadêmica IFES Campus Serra (MVP)

**Branch**: `001-academic-agenda` | **Date**: 2026-10-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-academic-agenda/spec.md` and Constitution from `.specify/memory/constitution.md`.

---

## Summary

O **AgendaIFES** é um sistema web de organização acadêmica local-first para estudantes do IFES Campus Serra. O MVP permite gerenciar disciplinas, professores, tarefas, prazos e prioridades com armazenamento exclusivo no navegador via `localStorage` e suporte robusto para backup/restauração em JSON. A arquitetura segue uma separação estrita entre interface (Next.js/React), lógica de domínio pura (TypeScript) e camada de persistência desacoplada (`IStorageAdapter`).

---

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+ LTS  
**Primary Dependencies**: Next.js 14+ (App Router com `output: 'export'`), React 18/19, Tailwind CSS, Zod, Lucide React (ícones acessíveis)  
**Storage**: Client-Side `localStorage` encapsulado por `LocalStorageAdapter` sob namespace `agenda_ifes_v1_store` com suporte a exportação/importação de arquivos JSON  
**Testing**: Vitest com `@testing-library/react` e `jsdom`  
**Target Platform**: Navegadores modernos (Desktop e Mobile) - SPA estática cliente-side com preparação para PWA offline  
**Project Type**: Aplicação Web cliente única (Single Web Application)  
**Performance Goals**: Tempo de carregamento inicial < 1s; interações de alternância de status, ordenação e filtros instantâneas (< 50ms); exportação de backup < 1s  
**Constraints**: Zero backend, zero banco de dados remoto, zero autenticação/login no MVP, 100% de privacidade (sem telemetria externa), conformidade com WCAG 2.1 AA / eMAG  
**Scale/Scope**: Uso individual por estudante no dispositivo, suportando com alta fluidez centenas de tarefas e dezenas de disciplinas (~5MB limite `localStorage`)  

---

## Constitution Check

*GATE: All gates evaluated against `.specify/memory/constitution.md`.*

| Princípio Constitucional | Status | Avaliação Técnica |
| :--- | :--- | :--- |
| **I. Spec-Driven & Acceptance-First** | **PASS** | Especificação completa com 3 User Stories priorizadas (P1, P2, P3), cenários `Given/When/Then`, casos extremos e critérios de aceitação testáveis em [spec.md](./spec.md). |
| **II. Local-First & Client-Side Architecture** | **PASS** | MVP estritamente local; persistência isolada em `IStorageAdapter`; exportação/importação JSON com contrato formal e sem dependência de rede após carregamento. |
| **III. Type Safety & Data Integrity** | **PASS** | TypeScript com checagens estritas; esquemas Zod em tempo de execução para validação de dados de storage e arquivos de backup; recuperação de dados corrompidos. |
| **IV. Simplicity & Scope Discipline (YAGNI)** | **PASS** | Gerenciamento de estado direto via React Context + hooks nativos; sem bibliotecas pesadas de estado ou servidores desnecessários; estrutura de componentes enxuta. |
| **V. Accessibility, Responsiveness & Privacy** | **PASS** | Interface responsiva mobile-first com Tailwind CSS; semântica HTML e atributos ARIA para leitores de tela; zero transmissão de dados para a internet ou segredos no repositório. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-academic-agenda/
├── plan.md              # Este plano técnico de implementação
├── research.md          # Decisões técnicas e justificativas de arquitetura
├── data-model.md        # Modelagem de dados, entidades e esquemas Zod
├── quickstart.md        # Guia de validação ponta a ponta e comandos
├── checklists/
│   └── requirements.md  # Checklist de qualidade da especificação
└── contracts/
    ├── storage-adapter.contract.md   # Contrato da camada de persistência local
    ├── backup-schema.contract.json   # Esquema JSON Schema para pacotes de backup
    └── domain-services.contract.md   # Contrato das funções puras de domínio
```

### Source Code Layout (repository root)

```text
src/
├── app/
│   ├── layout.tsx              # Root layout com tipografia, HTML semântico e AgendaProvider
│   ├── page.tsx                # Visão principal da agenda (tarefas, alertas de prazo e filtros)
│   ├── disciplinas/
│   │   └── page.tsx            # Gestão de disciplinas do semestre (CRUD e cores)
│   ├── backup/
│   │   └── page.tsx            # Painel de exportação e restauração de backups JSON
│   └── globals.css             # Diretivas do Tailwind CSS e estilos globais
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Barra de navegação responsiva e acessível
│   │   └── Container.tsx       # Contêiner centralizado responsivo
│   ├── tasks/
│   │   ├── TaskCard.tsx        # Card individual de tarefa com toggle rápido de conclusão
│   │   ├── TaskFormModal.tsx   # Modal acessível para criação e edição de tarefas
│   │   ├── TaskFilters.tsx     # Barra de filtros por disciplina, prioridade e status
│   │   └── UrgencyBadge.tsx    # Indicador visual de prazo (<24h urgente, vencida, no prazo)
│   ├── disciplines/
│   │   ├── DisciplineCard.tsx  # Card da disciplina com resumo de tarefas e docente
│   │   └── DisciplineModal.tsx # Modal de criação/edição de disciplinas com seletor de cor
│   ├── backup/
│   │   ├── ExportCard.tsx      # Ação de download seguro do arquivo de backup
│   │   └── ImportCard.tsx      # Upload de arquivo, validação prévia e confirmação
│   └── ui/
│       ├── Button.tsx          # Botão reutilizável acessível com estados de foco/loading
│       ├── Input.tsx           # Campo de entrada de texto com rótulos e mensagens de erro
│       ├── Modal.tsx           # Diálogo modal com foco retido (focus trap) e tecla Esc
│       └── Badge.tsx           # Tag/selo visual para categorias e prioridades
├── domain/
│   ├── models/
│   │   ├── disciplina.ts       # Tipos TypeScript e schemas Zod de Disciplina
│   │   ├── tarefa.ts           # Tipos TypeScript e schemas Zod de Tarefa
│   │   └── backup.ts           # Tipos TypeScript e schemas Zod do Pacote de Backup
│   └── services/
│       ├── task-service.ts     # Funções puras: calcularStatusVencimento, ordenar, filtrar
│       └── backup-service.ts   # Funções puras: validação de arquivos JSON e serialização
├── storage/
│   ├── storage-adapter.ts      # Interface IStorageAdapter e implementação LocalStorageAdapter
│   └── storage-keys.ts         # Constantes de namespace e rotinas de salvaguarda
└── context/
    ├── AgendaContext.tsx       # Provedor de contexto React e sincronização com storage
    └── useAgenda.ts            # Custom hook para consumo de estado e despachos de ações

tests/
├── domain/
│   ├── task-service.test.ts    # Testes unitários de prazos, ordenação e filtros
│   ├── backup-service.test.ts  # Testes de validação de JSON válido e rejeição de inválido
│   └── models.test.ts          # Testes de validação de schemas Zod
├── storage/
│   └── storage-adapter.test.ts # Testes do adaptador com localStorage e fallback em memória
└── components/
    ├── TaskCard.test.tsx       # Teste de renderização, conclusão e acessibilidade do card
    └── ImportCard.test.tsx     # Teste de fluxo de upload e alerta de confirmação
```

---

## Complexity Tracking

| Potencial Complexidade | Avaliação | Decisão / Justificativa |
| :--- | :--- | :--- |
| **Nenhum desvio detectado** | N/A | Toda a arquitetura foi mantida estritamente dentro dos princípios de simplicidade, local-first e YAGNI definidos na Constituição. |
