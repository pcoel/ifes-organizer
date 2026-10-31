import { describe, it, expect } from 'vitest';
import {
  calcularStatusVencimento,
  ordenarTarefas,
  filtrarTarefas,
} from '@/domain/services/task-service';
import { Tarefa } from '@/domain/models/tarefa';

describe('task-service (Domain Logic)', () => {
  const dataReferencia = new Date('2026-10-31T12:00:00.000Z');

  describe('calcularStatusVencimento', () => {
    it('retorna VENCIDA para tarefa pendente cujo prazo já passou', () => {
      const dataVencida = '2026-10-30T23:59';
      const status = calcularStatusVencimento(dataVencida, 'PENDENTE', dataReferencia);
      expect(status).toBe('VENCIDA');
    });

    it('retorna URGENTE para tarefa pendente com prazo em menos de 24 horas', () => {
      // 10 horas à frente da data de referência
      const dataUrgente = '2026-10-31T22:00';
      const status = calcularStatusVencimento(dataUrgente, 'PENDENTE', dataReferencia);
      expect(status).toBe('URGENTE');
    });

    it('retorna NO_PRAZO para tarefa pendente com prazo acima de 24 horas', () => {
      const dataNoPrazo = '2026-11-05T18:00';
      const status = calcularStatusVencimento(dataNoPrazo, 'PENDENTE', dataReferencia);
      expect(status).toBe('NO_PRAZO');
    });

    it('retorna NO_PRAZO sempre para tarefas já CONCLUIDAS, mesmo com data no passado', () => {
      const dataPassada = '2026-10-20T12:00';
      const status = calcularStatusVencimento(dataPassada, 'CONCLUIDA', dataReferencia);
      expect(status).toBe('NO_PRAZO');
    });
  });

  describe('ordenarTarefas', () => {
    const t1: Tarefa = {
      id: '1',
      titulo: 'Trabalho A',
      descricao: '',
      dataEntrega: '2026-11-10T12:00',
      prioridade: 'BAIXA',
      status: 'PENDENTE',
      disciplinaId: null,
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
      concluidaEm: null,
    };

    const t2: Tarefa = {
      id: '2',
      titulo: 'Prova B',
      descricao: '',
      dataEntrega: '2026-11-01T12:00',
      prioridade: 'ALTA',
      status: 'PENDENTE',
      disciplinaId: null,
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
      concluidaEm: null,
    };

    const t3: Tarefa = {
      id: '3',
      titulo: 'Exercício C',
      descricao: '',
      dataEntrega: '2026-11-05T12:00',
      prioridade: 'MEDIA',
      status: 'PENDENTE',
      disciplinaId: null,
      criadoEm: '2026-10-31T10:00:00.000Z',
      atualizadoEm: '2026-10-31T10:00:00.000Z',
      concluidaEm: null,
    };

    it('ordena por prazo mais próximo primeiro', () => {
      const ordenadas = ordenarTarefas([t1, t2, t3], 'prazo');
      expect(ordenadas.map((t) => t.id)).toEqual(['2', '3', '1']);
    });

    it('ordena por prioridade (ALTA > MEDIA > BAIXA)', () => {
      const ordenadas = ordenarTarefas([t1, t2, t3], 'prioridade');
      expect(ordenadas.map((t) => t.id)).toEqual(['2', '3', '1']);
    });

    it('ordena alfabeticamente por título', () => {
      const ordenadas = ordenarTarefas([t1, t2, t3], 'titulo');
      expect(ordenadas.map((t) => t.titulo)).toEqual(['Exercício C', 'Prova B', 'Trabalho A']);
    });
  });

  describe('filtrarTarefas', () => {
    const tarefas: Tarefa[] = [
      {
        id: '1',
        titulo: 'Física I - Lista',
        descricao: '',
        dataEntrega: '2026-11-02T10:00',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        disciplinaId: 'disc-fisica',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
      {
        id: '2',
        titulo: 'Cálculo - Prova',
        descricao: '',
        dataEntrega: '2026-11-03T10:00',
        prioridade: 'MEDIA',
        status: 'CONCLUIDA',
        disciplinaId: 'disc-calc',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: '2026-10-31T11:00:00.000Z',
      },
    ];

    it('filtra por status pendente', () => {
      const filtradas = filtrarTarefas(tarefas, { status: 'pendentes' });
      expect(filtradas).toHaveLength(1);
      expect(filtradas[0].id).toBe('1');
    });

    it('filtra por prioridade ALTA', () => {
      const filtradas = filtrarTarefas(tarefas, { prioridade: 'ALTA' });
      expect(filtradas).toHaveLength(1);
      expect(filtradas[0].id).toBe('1');
    });

    it('filtra por disciplinaId', () => {
      const filtradas = filtrarTarefas(tarefas, { disciplinaId: 'disc-calc' });
      expect(filtradas).toHaveLength(1);
      expect(filtradas[0].id).toBe('2');
    });

    it('filtra por termo de busca no título', () => {
      const filtradas = filtrarTarefas(tarefas, { termoBusca: 'física' });
      expect(filtradas).toHaveLength(1);
      expect(filtradas[0].id).toBe('1');
    });
  });
});
