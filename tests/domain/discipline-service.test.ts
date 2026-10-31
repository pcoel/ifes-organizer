import { describe, it, expect } from 'vitest';
import {
  validarNomeDisciplinaUnico,
  desvincularDisciplina,
  obterCoresPadrao,
} from '@/domain/services/discipline-service';
import { Disciplina } from '@/domain/models/disciplina';
import { Tarefa } from '@/domain/models/tarefa';

describe('discipline-service (Domain Logic)', () => {
  const disciplinasExistentes: Disciplina[] = [
    {
      id: 'd1',
      nome: 'Estruturas de Dados',
      professor: 'Prof. Lucas',
      sala: 'Lab 4',
      cor: '#006633',
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
    },
    {
      id: 'd2',
      nome: 'Banco de Dados',
      professor: 'Profa. Ana',
      sala: 'Lab 1',
      cor: '#1e40af',
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
    },
  ];

  describe('validarNomeDisciplinaUnico', () => {
    it('retorna true quando o nome é inédito', () => {
      expect(validarNomeDisciplinaUnico('Cálculo I', disciplinasExistentes)).toBe(true);
    });

    it('retorna false quando já existe disciplina com mesmo nome (case-insensitive e trim)', () => {
      expect(validarNomeDisciplinaUnico(' estruturas de dados ', disciplinasExistentes)).toBe(false);
      expect(validarNomeDisciplinaUnico('BANCO DE DADOS', disciplinasExistentes)).toBe(false);
    });

    it('permite o mesmo nome ao editar a própria disciplina ignorando seu id', () => {
      expect(validarNomeDisciplinaUnico('Estruturas de Dados', disciplinasExistentes, 'd1')).toBe(true);
    });
  });

  describe('desvincularDisciplina (Soft Decoupling)', () => {
    const tarefas: Tarefa[] = [
      {
        id: 't1',
        titulo: 'Árvores AVL',
        descricao: '',
        dataEntrega: '2026-11-04T23:59',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        disciplinaId: 'd1',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
      {
        id: 't2',
        titulo: 'Modelagem ER',
        descricao: '',
        dataEntrega: '2026-11-06T23:59',
        prioridade: 'MEDIA',
        status: 'PENDENTE',
        disciplinaId: 'd2',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
    ];

    it('desvincula suavemente a disciplina removida sem deletar a tarefa', () => {
      const resultado = desvincularDisciplina(tarefas, 'd1');

      expect(resultado).toHaveLength(2);
      const tarefaDesvinculada = resultado.find((t) => t.id === 't1');
      const tarefaIntacta = resultado.find((t) => t.id === 't2');

      expect(tarefaDesvinculada?.disciplinaId).toBeNull();
      expect(tarefaIntacta?.disciplinaId).toBe('d2');
    });
  });

  describe('obterCoresPadrao', () => {
    it('retorna lista de cores hexadecimais válidas incluindo o verde IFES', () => {
      const cores = obterCoresPadrao();
      expect(cores.length).toBeGreaterThan(5);
      expect(cores).toContain('#006633');
      cores.forEach((cor) => {
        expect(cor).toMatch(/^#([0-9A-Fa-f]{6})$/);
      });
    });
  });
});
