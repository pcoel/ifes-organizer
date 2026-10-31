import { z } from 'zod';

export const PrioridadeSchema = z.enum(['BAIXA', 'MEDIA', 'ALTA']);
export type PrioridadeTarefa = z.infer<typeof PrioridadeSchema>;

export const StatusTarefaSchema = z.enum(['PENDENTE', 'CONCLUIDA']);
export type StatusTarefa = z.infer<typeof StatusTarefaSchema>;

export const PRIORIDADE_ROTULOS: Record<PrioridadeTarefa, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};

export const STATUS_ROTULOS: Record<StatusTarefa, string> = {
  PENDENTE: 'Pendente',
  CONCLUIDA: 'Concluída',
};

export const TarefaSchema = z.object({
  id: z.string().min(1, 'ID obrigatório'),
  titulo: z.string().trim().min(3, 'Título deve ter no mínimo 3 caracteres').max(150, 'Título muito longo'),
  descricao: z.string().trim().max(1000, 'Descrição muito longa').optional().default(''),
  dataEntrega: z.string().min(10, 'Data de entrega inválida'),
  prioridade: PrioridadeSchema.default('MEDIA'),
  status: StatusTarefaSchema.default('PENDENTE'),
  disciplinaId: z.string().nullable().default(null),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
  concluidaEm: z.string().datetime().nullable().default(null),
});

export type Tarefa = z.infer<typeof TarefaSchema>;

export const NovaTarefaInputSchema = TarefaSchema.omit({
  id: true,
  status: true,
  criadoEm: true,
  atualizadoEm: true,
  concluidaEm: true,
});

export type NovaTarefaInput = z.infer<typeof NovaTarefaInputSchema>;
