import { z } from 'zod';

export const DisciplinaSchema = z.object({
  id: z.string().min(1, 'ID obrigatório'),
  nome: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  professor: z.string().trim().max(100, 'Nome do professor muito longo').optional().default(''),
  sala: z.string().trim().max(50, 'Local da sala muito longo').optional().default(''),
  cor: z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'Cor inválida (deve ser hex #RRGGBB)'),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

export type Disciplina = z.infer<typeof DisciplinaSchema>;

export const NovaDisciplinaInputSchema = DisciplinaSchema.omit({
  id: true,
  criadoEm: true,
  atualizadoEm: true,
});

export type NovaDisciplinaInput = z.infer<typeof NovaDisciplinaInputSchema>;
