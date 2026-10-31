import { describe, it, expect } from 'vitest';
import {
  gerarPacoteBackup,
  gerarNomeArquivoBackup,
  validarPacoteBackup,
} from '@/domain/services/backup-service';
import { Disciplina } from '@/domain/models/disciplina';
import { Tarefa } from '@/domain/models/tarefa';

describe('backup-service (Domain Logic)', () => {
  const disciplinasMock: Disciplina[] = [
    {
      id: 'd1',
      nome: 'Banco de Dados',
      professor: 'Profa. Ana',
      sala: 'Lab 1',
      cor: '#006633',
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
    },
  ];

  const tarefasMock: Tarefa[] = [
    {
      id: 't1',
      titulo: 'Lista SQL',
      descricao: 'Entregar via AVA',
      dataEntrega: '2026-11-04T23:59',
      prioridade: 'ALTA',
      status: 'PENDENTE',
      disciplinaId: 'd1',
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
      concluidaEm: null,
    },
  ];

  describe('gerarPacoteBackup & gerarNomeArquivoBackup', () => {
    it('gera pacote de backup completo no esquema v1', () => {
      const pacote = gerarPacoteBackup(disciplinasMock, tarefasMock);
      expect(pacote.versaoSchema).toBe(1);
      expect(pacote.origem).toBe('AgendaIFES');
      expect(pacote.dados.disciplinas).toHaveLength(1);
      expect(pacote.dados.tarefas).toHaveLength(1);
      expect(new Date(pacote.geradoEm).getTime()).toBeGreaterThan(0);
    });

    it('gera nome de arquivo com carimbo de data e hora padronizado', () => {
      const data = new Date('2026-10-31T15:30:00.000Z');
      const nomeArquivo = gerarNomeArquivoBackup(data);
      expect(nomeArquivo).toMatch(/^agenda-ifes-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
    });
  });

  describe('validarPacoteBackup', () => {
    it('valida com sucesso um backup JSON íntegro', () => {
      const pacote = gerarPacoteBackup(disciplinasMock, tarefasMock);
      const jsonTexto = JSON.stringify(pacote);

      const resultado = validarPacoteBackup(jsonTexto);
      expect(resultado.sucesso).toBe(true);
      if (resultado.sucesso) {
        expect(resultado.dados.dados.tarefas[0].titulo).toBe('Lista SQL');
        expect(resultado.dados.dados.disciplinas[0].nome).toBe('Banco de Dados');
      }
    });

    it('rejeita com mensagem clara caso o texto não seja um JSON válido', () => {
      const resultado = validarPacoteBackup('conteudo invalido { [');
      expect(resultado.sucesso).toBe(false);
      if (!resultado.sucesso) {
        expect(resultado.erro).toContain('Formato de arquivo inválido');
      }
    });

    it('rejeita backup com versaoSchema incompatível ou origem incorreta', () => {
      const invalido = {
        versaoSchema: 99,
        origem: 'OutroApp',
        geradoEm: new Date().toISOString(),
        dados: { disciplinas: [], tarefas: [] },
      };

      const resultado = validarPacoteBackup(JSON.stringify(invalido));
      expect(resultado.sucesso).toBe(false);
      if (!resultado.sucesso) {
        expect(resultado.erro).toContain('incompatível');
      }
    });

    it('rejeita backup contendo tarefas com violações de regras do Zod', () => {
      const corrompido = {
        versaoSchema: 1,
        origem: 'AgendaIFES',
        geradoEm: new Date().toISOString(),
        dados: {
          disciplinas: [],
          tarefas: [{ id: '1', titulo: 'X' }], // falta dataEntrega, titulo < 3 chars
        },
      };

      const resultado = validarPacoteBackup(JSON.stringify(corrompido));
      expect(resultado.sucesso).toBe(false);
      if (!resultado.sucesso) {
        expect(resultado.erro).toContain('Estrutura de dados corrompida');
      }
    });
  });
});
