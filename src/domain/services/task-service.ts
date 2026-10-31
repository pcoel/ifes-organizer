import { Tarefa, PrioridadeTarefa } from '@/domain/models/tarefa';

export type StatusVencimento = 'VENCIDA' | 'URGENTE' | 'NO_PRAZO';

export interface FiltrosTarefa {
  status?: 'todos' | 'pendentes' | 'concluidas';
  prioridade?: 'TODAS' | PrioridadeTarefa;
  disciplinaId?: string | 'TODAS' | 'SEM_DISCIPLINA';
  termoBusca?: string;
}

export type CriterioOrdenacao = 'prazo' | 'prioridade' | 'titulo';

/**
 * Determina se a tarefa está vencida, urgente (< 24h) ou no prazo em relação à data de referência.
 */
export function calcularStatusVencimento(
  dataEntrega: string,
  status: 'PENDENTE' | 'CONCLUIDA',
  dataReferencia: Date = new Date()
): StatusVencimento {
  if (status === 'CONCLUIDA') {
    return 'NO_PRAZO';
  }

  const prazoMillis = new Date(dataEntrega).getTime();
  const refMillis = dataReferencia.getTime();
  const diffMillis = prazoMillis - refMillis;

  if (diffMillis < 0) {
    return 'VENCIDA';
  }

  const vinteQuatroHorasMillis = 24 * 60 * 60 * 1000;
  if (diffMillis <= vinteQuatroHorasMillis) {
    return 'URGENTE';
  }

  return 'NO_PRAZO';
}

/**
 * Formata data e hora ISO para exibição no padrão brasileiro pt-BR.
 */
export function formatarDataPrazo(dataIso: string): string {
  try {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return dataIso;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  } catch {
    return dataIso;
  }
}

/**
 * Ordena coleção de tarefas conforme o critério solicitado.
 */
export function ordenarTarefas(
  tarefas: Tarefa[],
  criterio: CriterioOrdenacao
): Tarefa[] {
  const lista = [...tarefas];

  switch (criterio) {
    case 'prazo':
      return lista.sort((a, b) => {
        // Tarefas concluídas vão para o final
        if (a.status !== b.status) {
          return a.status === 'CONCLUIDA' ? 1 : -1;
        }
        return new Date(a.dataEntrega).getTime() - new Date(b.dataEntrega).getTime();
      });

    case 'prioridade': {
      const peso: Record<PrioridadeTarefa, number> = {
        ALTA: 3,
        MEDIA: 2,
        BAIXA: 1,
      };
      return lista.sort((a, b) => peso[b.prioridade] - peso[a.prioridade]);
    }

    case 'titulo':
      return lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR', { sensitivity: 'base' }));

    default:
      return lista;
  }
}

/**
 * Filtra tarefas com base em status, prioridade, disciplina e busca textual.
 */
export function filtrarTarefas(
  tarefas: Tarefa[],
  filtros: FiltrosTarefa
): Tarefa[] {
  return tarefas.filter((t) => {
    // Filtro por status
    if (filtros.status === 'pendentes' && t.status !== 'PENDENTE') return false;
    if (filtros.status === 'concluidas' && t.status !== 'CONCLUIDA') return false;

    // Filtro por prioridade
    if (filtros.prioridade && filtros.prioridade !== 'TODAS' && t.prioridade !== filtros.prioridade) {
      return false;
    }

    // Filtro por disciplina
    if (filtros.disciplinaId && filtros.disciplinaId !== 'TODAS') {
      if (filtros.disciplinaId === 'SEM_DISCIPLINA' && t.disciplinaId !== null) {
        return false;
      }
      if (filtros.disciplinaId !== 'SEM_DISCIPLINA' && t.disciplinaId !== filtros.disciplinaId) {
        return false;
      }
    }

    // Filtro por termo de busca
    if (filtros.termoBusca && filtros.termoBusca.trim().length > 0) {
      const termo = filtros.termoBusca.toLowerCase().trim();
      const matchTitulo = t.titulo.toLowerCase().includes(termo);
      const matchDescricao = t.descricao ? t.descricao.toLowerCase().includes(termo) : false;
      if (!matchTitulo && !matchDescricao) return false;
    }

    return true;
  });
}
