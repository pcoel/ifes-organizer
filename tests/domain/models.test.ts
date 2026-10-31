import { describe, it, expect } from 'vitest';
import { DisciplinaSchema } from '@/domain/models/disciplina';
import { TarefaSchema, PRIORIDADE_ROTULOS, STATUS_ROTULOS } from '@/domain/models/tarefa';
import { ConfiguracoesSchema, CONFIGURACOES_PADRAO } from '@/domain/models/configuracao';

describe('Domain Models Validation', () => {
  describe('DisciplinaSchema', () => {
    it('valida com sucesso uma disciplina válida', () => {
      const disciplinaValida = {
        id: 'disc-1',
        nome: 'Programação Web',
        professor: 'Prof. Silva',
        sala: 'Lab 2',
        cor: '#006633',
        criadoEm: '2026-10-31T12:00:00.000Z',
        atualizadoEm: '2026-10-31T12:00:00.000Z',
      };

      const resultado = DisciplinaSchema.safeParse(disciplinaValida);
      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.nome).toBe('Programação Web');
        expect(resultado.data.cor).toBe('#006633');
      }
    });

    it('rejeita disciplina com nome menor que 2 caracteres', () => {
      const invalida = {
        id: 'disc-1',
        nome: 'A',
        cor: '#006633',
        criadoEm: '2026-10-31T12:00:00.000Z',
        atualizadoEm: '2026-10-31T12:00:00.000Z',
      };

      const resultado = DisciplinaSchema.safeParse(invalida);
      expect(resultado.success).toBe(false);
    });

    it('rejeita disciplina com código de cor inválido', () => {
      const invalida = {
        id: 'disc-1',
        nome: 'Redes',
        cor: 'verde-ifes',
        criadoEm: '2026-10-31T12:00:00.000Z',
        atualizadoEm: '2026-10-31T12:00:00.000Z',
      };

      const resultado = DisciplinaSchema.safeParse(invalida);
      expect(resultado.success).toBe(false);
    });
  });

  describe('TarefaSchema', () => {
    it('valida com sucesso uma tarefa válida e define defaults', () => {
      const tarefaValida = {
        id: 'task-1',
        titulo: 'Trabalho de Compiladores',
        dataEntrega: '2026-11-05T23:59',
        criadoEm: '2026-10-31T12:00:00.000Z',
        atualizadoEm: '2026-10-31T12:00:00.000Z',
      };

      const resultado = TarefaSchema.safeParse(tarefaValida);
      expect(resultado.success).toBe(true);
      if (resultado.success) {
        expect(resultado.data.prioridade).toBe('MEDIA');
        expect(resultado.data.status).toBe('PENDENTE');
        expect(resultado.data.disciplinaId).toBeNull();
      }
    });

    it('rejeita tarefa com título com menos de 3 caracteres', () => {
      const invalida = {
        id: 'task-1',
        titulo: 'Oi',
        dataEntrega: '2026-11-05T23:59',
        criadoEm: '2026-10-31T12:00:00.000Z',
        atualizadoEm: '2026-10-31T12:00:00.000Z',
      };

      const resultado = TarefaSchema.safeParse(invalida);
      expect(resultado.success).toBe(false);
    });

    it('mantém rótulos legíveis em português para valores padronizados', () => {
      expect(PRIORIDADE_ROTULOS.BAIXA).toBe('Baixa');
      expect(PRIORIDADE_ROTULOS.MEDIA).toBe('Média');
      expect(PRIORIDADE_ROTULOS.ALTA).toBe('Alta');

      expect(STATUS_ROTULOS.PENDENTE).toBe('Pendente');
      expect(STATUS_ROTULOS.CONCLUIDA).toBe('Concluída');
    });
  });

  describe('ConfiguracoesSchema', () => {
    it('retorna os valores padrão corretos', () => {
      const config = ConfiguracoesSchema.parse({});
      expect(config).toEqual(CONFIGURACOES_PADRAO);
    });
  });
});
