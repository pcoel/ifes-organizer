# Contract: Academic Domain Services

**Feature**: `001-academic-agenda`  
**Target**: Pure Domain Logic Layer  
**Language/Runtime**: TypeScript  

---

## 1. Overview

Todos os cálculos de prazos, ordenação cronológica, filtros de urgência e operações de desassociação de dados são modelados como funções puras, sem efeitos colaterais e desacopladas de componentes visuais do React.

---

## 2. Functions & Signatures

```typescript
export type StatusVencimento = 'VENCIDA' | 'URGENTE' | 'NO_PRAZO';

export interface FiltrosTarefa {
  status?: 'todos' | 'pendentes' | 'concluidas';
  prioridade?: 'TODAS' | 'BAIXA' | 'MEDIA' | 'ALTA';
  disciplinaId?: string | 'TODAS' | 'SEM_DISCIPLINA';
  termoBusca?: string;
}

export type CriterioOrdenacao = 'prazo' | 'prioridade' | 'titulo';

/**
 * Determina o status de vencimento de uma tarefa em relação à data/hora de referência.
 */
export function calcularStatusVencimento(
  dataEntrega: string,
  status: 'PENDENTE' | 'CONCLUIDA',
  dataReferencia: Date = new Date()
): StatusVencimento;

/**
 * Ordena uma coleção de tarefas segundo o critério especificado.
 * Para 'prazo', tarefas pendentes mais próximas ou atrasadas vêm primeiro.
 * Para 'prioridade', a ordem é ALTA > MEDIA > BAIXA.
 * Para 'titulo', ordem alfabética case-insensitive.
 */
export function ordenarTarefas(
  tarefas: Tarefa[],
  criterio: CriterioOrdenacao
): Tarefa[];

/**
 * Aplica filtros combinados (status, prioridade, disciplina, busca por texto)
 * sobre a lista de tarefas.
 */
export function filtrarTarefas(
  tarefas: Tarefa[],
  filtros: FiltrosTarefa
): Tarefa[];

/**
 * Desassocia uma disciplina excluída de todas as tarefas associadas,
 * definindo disciplinaId como null sem excluir a tarefa.
 */
export function desvincularDisciplina(
  tarefas: Tarefa[],
  disciplinaIdRemovida: string
): Tarefa[];

/**
 * Valida o conteúdo textual bruto de um arquivo JSON de backup.
 * Retorna sucesso com o objeto tipado ou erro estruturado com mensagens claras.
 */
export function validarPacoteBackup(
  conteudoJsonTexto: string
): { sucesso: true; dados: PacoteBackup } | { sucesso: false; erro: string; detalhes?: string[] };
```

---

## 3. Testability Invariants

1. **Determinismo Temporal**:
   - `calcularStatusVencimento` DEVE aceitar `dataReferencia` como parâmetro opcional (padrão `new Date()`) para viabilizar testes unitários sem manipulação frágil de relógios globais.
2. **Imutabilidade**:
   - Funções de ordenação e filtro DEVEM retornar novos arrays, preservando os arrays originais intactos.
