import { z } from 'zod';

export const ConfiguracoesSchema = z.object({
  tema: z.enum(['claro', 'escuro', 'sistema']).default('sistema'),
  ordenacaoPadrao: z.enum(['prazo', 'prioridade', 'titulo']).default('prazo'),
  filtroStatusPadrao: z.enum(['todos', 'pendentes', 'concluidas']).default('pendentes'),
});

export type ConfiguracoesUsuario = z.infer<typeof ConfiguracoesSchema>;

export const CONFIGURACOES_PADRAO: ConfiguracoesUsuario = {
  tema: 'sistema',
  ordenacaoPadrao: 'prazo',
  filtroStatusPadrao: 'pendentes',
};
