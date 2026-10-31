import { Disciplina } from '@/domain/models/disciplina';
import { Tarefa } from '@/domain/models/tarefa';

/**
 * Cores pré-definidas recomendadas para disciplinas (incluindo verde institucional IFES).
 */
export const CORES_DISCIPLINA_PADRAO = [
  '#006633', // Verde IFES
  '#1e40af', // Azul Royal
  '#6b21a8', // Roxo
  '#b91c1c', // Vermelho Escuro
  '#c2410c', // Laranja
  '#0f766e', // Verde Petróleo
  '#4338ca', // Índigo
  '#be185d', // Rosa Queimado
  '#374151', // Grafite
];

export function obterCoresPadrao(): string[] {
  return [...CORES_DISCIPLINA_PADRAO];
}

/**
 * Valida se o nome da disciplina é único (case-insensitive após trim),
 * permitindo ignorar um ID em caso de edição da própria entidade.
 */
export function validarNomeDisciplinaUnico(
  nome: string,
  disciplinas: Disciplina[],
  idIgnorar?: string
): boolean {
  const nomeNormalizado = nome.trim().toLowerCase();

  return !disciplinas.some(
    (d) => d.id !== idIgnorar && d.nome.trim().toLowerCase() === nomeNormalizado
  );
}

/**
 * Desassocia uma disciplina removida de todas as tarefas associadas,
 * definindo disciplinaId como null e atualizando timestamp, preservando as tarefas intactas.
 */
export function desvincularDisciplina(
  tarefas: Tarefa[],
  disciplinaIdRemovida: string
): Tarefa[] {
  const agora = new Date().toISOString();

  return tarefas.map((tarefa) => {
    if (tarefa.disciplinaId === disciplinaIdRemovida) {
      return {
        ...tarefa,
        disciplinaId: null,
        atualizadoEm: agora,
      };
    }
    return tarefa;
  });
}
