import { Disciplina } from '@/domain/models/disciplina';
import { Tarefa } from '@/domain/models/tarefa';
import { ConfiguracoesUsuario } from '@/domain/models/configuracao';
import { PacoteBackup, PacoteBackupSchema } from '@/domain/models/backup';

/**
 * Cria um objeto formal de backup a partir do estado atual da aplicação.
 */
export function gerarPacoteBackup(
  disciplinas: Disciplina[],
  tarefas: Tarefa[],
  configuracoes?: ConfiguracoesUsuario
): PacoteBackup {
  return {
    versaoSchema: 1,
    origem: 'AgendaIFES',
    geradoEm: new Date().toISOString(),
    dados: {
      disciplinas,
      tarefas,
      configuracoes,
    },
  };
}

/**
 * Gera nome do arquivo para download com timestamp local YYYY-MM-DD-HHmm.
 */
export function gerarNomeArquivoBackup(data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');

  return `agenda-ifes-backup-${ano}-${mes}-${dia}-${hora}${minuto}.json`;
}

export type ValidacaoBackupResultado =
  | { sucesso: true; dados: PacoteBackup }
  | { sucesso: false; erro: string; detalhes?: string[] };

/**
 * Valida rigorosamente o conteúdo em string de um arquivo JSON submetido para restauração.
 */
export function validarPacoteBackup(conteudoJsonTexto: string): ValidacaoBackupResultado {
  let objetoJson: unknown;

  try {
    objetoJson = JSON.parse(conteudoJsonTexto);
  } catch {
    return {
      sucesso: false,
      erro: 'Formato de arquivo inválido. O arquivo não é um JSON válido.',
    };
  }

  const parseResult = PacoteBackupSchema.safeParse(objetoJson);

  if (!parseResult.success) {
    const mensagens = parseResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
    const erroPrincipal = parseResult.error.errors[0]?.message || 'Estrutura de dados corrompida ou incompatível.';

    return {
      sucesso: false,
      erro: `Estrutura de dados corrompida ou incompatível: ${erroPrincipal}`,
      detalhes: mensagens,
    };
  }

  return {
    sucesso: true,
    dados: parseResult.data,
  };
}
