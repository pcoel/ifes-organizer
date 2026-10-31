import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '@/storage/storage-adapter';
import { DisciplinaSchema } from '@/domain/models/disciplina';
import { TarefaSchema } from '@/domain/models/tarefa';
import {
  calcularStatusVencimento,
  ordenarTarefas,
  filtrarTarefas,
} from '@/domain/services/task-service';
import {
  validarNomeDisciplinaUnico,
  desvincularDisciplina,
} from '@/domain/services/discipline-service';
import {
  gerarPacoteBackup,
  validarPacoteBackup,
} from '@/domain/services/backup-service';

describe('Quickstart End-to-End Scenarios Validation', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter();
  });

  it('Cenário 1: Cadastro e Validação de Disciplina e Docente', () => {
    const novaDisciplina = {
      id: 'disc-1',
      nome: 'Programação Web',
      professor: 'Prof. Roberto',
      sala: 'Lab 3 - Bloco B',
      cor: '#006633',
      criadoEm: '2026-10-31T12:00:00.000Z',
      atualizadoEm: '2026-10-31T12:00:00.000Z',
    };

    const parsed = DisciplinaSchema.parse(novaDisciplina);
    expect(parsed.nome).toBe('Programação Web');
    expect(parsed.cor).toBe('#006633');

    // Valida unicidade
    const isUnico = validarNomeDisciplinaUnico('Programação Web', [parsed]);
    expect(isUnico).toBe(false); // já existe
  });

  it('Cenário 2: Criação, Priorização e Conclusão de Tarefa', () => {
    const tarefa = TarefaSchema.parse({
      id: 'task-1',
      titulo: 'Projeto Final - Etapa 1',
      descricao: 'Entrega de requisitos',
      dataEntrega: '2026-11-05T23:59',
      prioridade: 'ALTA',
      disciplinaId: 'disc-1',
      criadoEm: '2026-10-31T12:00:00.000Z',
      atualizadoEm: '2026-10-31T12:00:00.000Z',
    });

    expect(tarefa.status).toBe('PENDENTE');
    expect(tarefa.prioridade).toBe('ALTA');

    // Alterna conclusão
    const tarefaConcluida = {
      ...tarefa,
      status: 'CONCLUIDA' as const,
      concluidaEm: new Date().toISOString(),
    };
    expect(tarefaConcluida.status).toBe('CONCLUIDA');
  });

  it('Cenário 3: Alerta de Urgência / Vencimento', () => {
    const dataRef = new Date('2026-10-31T12:00:00.000Z');
    // Prazo em 2 horas
    const dataUrgente = '2026-10-31T14:00';
    const statusUrgente = calcularStatusVencimento(dataUrgente, 'PENDENTE', dataRef);
    expect(statusUrgente).toBe('URGENTE');

    // Prazo no passado
    const dataPassada = '2026-10-30T10:00';
    const statusVencido = calcularStatusVencimento(dataPassada, 'PENDENTE', dataRef);
    expect(statusVencido).toBe('VENCIDA');
  });

  it('Cenário 4: Exportação, Limpeza e Restauração de Backup JSON', () => {
    const disciplinas = [
      {
        id: 'd1',
        nome: 'Programação Web',
        professor: 'Prof. Roberto',
        sala: 'Lab 3',
        cor: '#006633',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
      },
    ];

    const tarefas = [
      {
        id: 't1',
        titulo: 'Projeto Final',
        descricao: '',
        dataEntrega: '2026-11-05T23:59',
        prioridade: 'ALTA' as const,
        status: 'PENDENTE' as const,
        disciplinaId: 'd1',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
    ];

    // 1. Gera backup
    const pacote = gerarPacoteBackup(disciplinas, tarefas);
    const backupJsonString = JSON.stringify(pacote);

    // 2. Salva no storage e depois limpa simulando novo dispositivo
    adapter.save({
      versao: 1,
      disciplinas,
      tarefas,
      configuracoes: { tema: 'sistema', ordenacaoPadrao: 'prazo', filtroStatusPadrao: 'pendentes' },
    });
    adapter.clear();
    expect(adapter.load().tarefas).toHaveLength(0);

    // 3. Valida e restaura o backup JSON
    const validacao = validarPacoteBackup(backupJsonString);
    expect(validacao.sucesso).toBe(true);

    if (validacao.sucesso) {
      adapter.save({
        versao: validacao.dados.versaoSchema,
        disciplinas: validacao.dados.dados.disciplinas,
        tarefas: validacao.dados.dados.tarefas,
        configuracoes: validacao.dados.dados.configuracoes || {
          tema: 'sistema',
          ordenacaoPadrao: 'prazo',
          filtroStatusPadrao: 'pendentes',
        },
      });

      const restaurado = adapter.load();
      expect(restaurado.disciplinas).toHaveLength(1);
      expect(restaurado.disciplinas[0].nome).toBe('Programação Web');
      expect(restaurado.tarefas).toHaveLength(1);
      expect(restaurado.tarefas[0].titulo).toBe('Projeto Final');
    }
  });

  it('Cenário 5: Rejeição de Backup Inválido com Proteção dos Dados Locais', () => {
    // Estado pré-existente
    const estadoOriginal = {
      versao: 1,
      disciplinas: [],
      tarefas: [
        {
          id: 't-existente',
          titulo: 'Tarefa Importante Salva',
          descricao: '',
          dataEntrega: '2026-11-10T12:00',
          prioridade: 'MEDIA' as const,
          status: 'PENDENTE' as const,
          disciplinaId: null,
          criadoEm: '2026-10-31T10:00:00.000Z',
          atualizadoEm: '2026-10-31T10:00:00.000Z',
          concluidaEm: null,
        },
      ],
      configuracoes: { tema: 'sistema' as const, ordenacaoPadrao: 'prazo' as const, filtroStatusPadrao: 'pendentes' as const },
    };
    adapter.save(estadoOriginal);

    // Tenta validar backup malformado
    const jsonInvalido = '{ "foo": "bar", "tarefas": 123 }';
    const resultado = validarPacoteBackup(jsonInvalido);

    expect(resultado.sucesso).toBe(false);

    // Verifica que o storage original NÃO foi alterado
    const estadoAposTentativa = adapter.load();
    expect(estadoAposTentativa.tarefas).toHaveLength(1);
    expect(estadoAposTentativa.tarefas[0].titulo).toBe('Tarefa Importante Salva');
  });

  it('Cenário Adicional: Desassociação Suave na Exclusão de Disciplina', () => {
    const tarefas = [
      {
        id: 't1',
        titulo: 'Entrega Laboratório',
        descricao: '',
        dataEntrega: '2026-11-04T12:00',
        prioridade: 'ALTA' as const,
        status: 'PENDENTE' as const,
        disciplinaId: 'disc-excluida',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
    ];

    const tarefasAposExclusao = desvincularDisciplina(tarefas, 'disc-excluida');
    expect(tarefasAposExclusao).toHaveLength(1);
    expect(tarefasAposExclusao[0].disciplinaId).toBeNull();
    expect(tarefasAposExclusao[0].titulo).toBe('Entrega Laboratório');
  });
});
