import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportCard } from '@/components/backup/ExportCard';
import { ImportCard } from '@/components/backup/ImportCard';
import { AgendaContext, AgendaContextValue } from '@/context/AgendaContext';
import { ESTADO_INICIAL_AGENDA } from '@/storage/storage-adapter';

const mockContextValue: AgendaContextValue = {
  state: {
    ...ESTADO_INICIAL_AGENDA,
    disciplinas: [
      {
        id: 'd1',
        nome: 'Física I',
        professor: 'Prof. Souza',
        sala: '',
        cor: '#006633',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
      },
    ],
    tarefas: [
      {
        id: 't1',
        titulo: 'Experimento Pêndulo',
        descricao: '',
        dataEntrega: '2026-11-05T18:00',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        disciplinaId: 'd1',
        criadoEm: '2026-10-31T10:00:00.000Z',
        atualizadoEm: '2026-10-31T10:00:00.000Z',
        concluidaEm: null,
      },
    ],
  },
  isLoading: false,
  storageWarning: null,
  adicionarTarefa: vi.fn(),
  atualizarTarefa: vi.fn(),
  alternarStatusTarefa: vi.fn(),
  excluirTarefa: vi.fn(),
  adicionarDisciplina: vi.fn(),
  atualizarDisciplina: vi.fn(),
  excluirDisciplina: vi.fn(),
  atualizarConfiguracoes: vi.fn(),
  restaurarBackup: vi.fn(),
  limparAgenda: vi.fn(),
};

describe('Backup Components', () => {
  describe('ExportCard', () => {
    it('renderiza contagem correta de disciplinas e tarefas a serem exportadas', () => {
      render(
        <AgendaContext.Provider value={mockContextValue}>
          <ExportCard />
        </AgendaContext.Provider>
      );

      expect(screen.getByText('Disciplinas cadastradas:')).toBeInTheDocument();
      expect(screen.getByText('Tarefas acadêmicas:')).toBeInTheDocument();
      expect(screen.getAllByText('1')).toHaveLength(2);
      expect(screen.getByText('Baixar Backup (.json)')).toBeInTheDocument();
    });
  });

  describe('ImportCard', () => {
    it('renderiza o seletor de arquivos de restauração', () => {
      render(
        <AgendaContext.Provider value={mockContextValue}>
          <ImportCard />
        </AgendaContext.Provider>
      );

      expect(screen.getByText(/Clique para selecionar o arquivo de backup/i)).toBeInTheDocument();
    });

    it('exibe alerta de erro ao selecionar arquivo que não é .json', async () => {
      render(
        <AgendaContext.Provider value={mockContextValue}>
          <ImportCard />
        </AgendaContext.Provider>
      );

      const input = document.getElementById('backup-file-input') as HTMLInputElement;
      const file = new File(['texto'], 'documento.txt', { type: 'text/plain' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Selecione um arquivo com extensão .json válido/i)).toBeInTheDocument();
      });
      expect(mockContextValue.restaurarBackup).not.toHaveBeenCalled();
    });
  });
});
