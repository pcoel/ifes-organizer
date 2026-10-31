import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAdapter, ESTADO_INICIAL_AGENDA } from '@/storage/storage-adapter';
import { STORAGE_KEYS } from '@/storage/storage-keys';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter();
  });

  it('retorna estado inicial vazio quando o localStorage não possui dados', () => {
    const estado = adapter.load();
    expect(estado).toEqual(ESTADO_INICIAL_AGENDA);
    expect(estado.tarefas).toHaveLength(0);
    expect(estado.disciplinas).toHaveLength(0);
  });

  it('persiste os dados e os recupera com fidelidade (simulação de recarregamento de página)', () => {
    const estadoSalvar = {
      versao: 1,
      disciplinas: [
        {
          id: 'disc-1',
          nome: 'Engenharia de Software',
          professor: 'Prof. Carlos',
          sala: 'Lab 1',
          cor: '#006633',
          criadoEm: '2026-10-31T10:00:00.000Z',
          atualizadoEm: '2026-10-31T10:00:00.000Z',
        },
      ],
      tarefas: [
        {
          id: 'task-1',
          titulo: 'Diagrama de Classes',
          descricao: 'Entregar via AVA',
          dataEntrega: '2026-11-04T23:59',
          prioridade: 'ALTA' as const,
          status: 'PENDENTE' as const,
          disciplinaId: 'disc-1',
          criadoEm: '2026-10-31T10:00:00.000Z',
          atualizadoEm: '2026-10-31T10:00:00.000Z',
          concluidaEm: null,
        },
      ],
      configuracoes: {
        tema: 'sistema' as const,
        ordenacaoPadrao: 'prazo' as const,
        filtroStatusPadrao: 'pendentes' as const,
      },
    };

    adapter.save(estadoSalvar);

    // Novo adapter simulando reabertura da aba / recarregamento da página
    const novoAdapter = new LocalStorageAdapter();
    const recuperado = novoAdapter.load();

    expect(recuperado.disciplinas).toHaveLength(1);
    expect(recuperado.disciplinas[0].nome).toBe('Engenharia de Software');
    expect(recuperado.tarefas).toHaveLength(1);
    expect(recuperado.tarefas[0].titulo).toBe('Diagrama de Classes');
  });

  it('salva cópia de salvaguarda quando detecta dados corrompidos e emite aviso', () => {
    // Insere dados corrompidos que violam o schema do Zod
    localStorage.setItem(
      STORAGE_KEYS.MAIN_STORE,
      JSON.stringify({ versao: 1, tarefas: [{ id: 'invalido', titulo: 'X' }] }) // titulo < 3 chars
    );

    const estadoRecuperado = adapter.load();
    expect(estadoRecuperado).toEqual(ESTADO_INICIAL_AGENDA);

    const aviso = adapter.getWarning();
    expect(aviso).not.toBeNull();
    expect(aviso?.type).toBe('CORRUPTED_DATA');

    // Verifica se uma chave de salvaguarda foi preservada
    const chavesNoStorage = Object.keys(localStorage);
    const chaveCorrompida = chavesNoStorage.find((k) => k.startsWith(STORAGE_KEYS.CORRUPTED_PREFIX));
    expect(chaveCorrompida).toBeDefined();
  });

  it('limpa os dados locais ao invocar clear()', () => {
    adapter.save({
      ...ESTADO_INICIAL_AGENDA,
      tarefas: [
        {
          id: 'task-1',
          titulo: 'Tarefa Teste',
          descricao: '',
          dataEntrega: '2026-11-01T12:00',
          prioridade: 'MEDIA',
          status: 'PENDENTE',
          disciplinaId: null,
          criadoEm: '2026-10-31T10:00:00.000Z',
          atualizadoEm: '2026-10-31T10:00:00.000Z',
          concluidaEm: null,
        },
      ],
    });

    expect(localStorage.getItem(STORAGE_KEYS.MAIN_STORE)).not.toBeNull();
    adapter.clear();
    expect(localStorage.getItem(STORAGE_KEYS.MAIN_STORE)).toBeNull();
  });
});
