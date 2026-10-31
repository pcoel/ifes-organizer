import { z } from 'zod';
import { DisciplinaSchema } from './disciplina';
import { TarefaSchema } from './tarefa';
import { ConfiguracoesSchema } from './configuracao';

export const PacoteBackupSchema = z.object({
  versaoSchema: z.literal(1, {
    invalid_type_error: 'Apenas a versão 1 do esquema de backup é suportada.',
  }),
  origem: z.literal('AgendaIFES', {
    invalid_type_error: 'Arquivo de backup deve ter origem "AgendaIFES".',
  }),
  geradoEm: z.string().datetime({
    message: 'Data de geração deve ser um carimbo de data/hora ISO 8601 válido.',
  }),
  dados: z.object({
    disciplinas: z.array(DisciplinaSchema),
    tarefas: z.array(TarefaSchema),
    configuracoes: ConfiguracoesSchema.optional(),
  }),
});

export type PacoteBackup = z.infer<typeof PacoteBackupSchema>;
