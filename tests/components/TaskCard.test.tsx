import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Tarefa } from '@/domain/models/tarefa';

describe('TaskCard Component', () => {
  const tarefaMock: Tarefa = {
    id: 'task-100',
    titulo: 'Projeto de Redes de Computadores',
    descricao: 'Configurar roteador Cisco',
    dataEntrega: '2026-11-15T23:59',
    prioridade: 'ALTA',
    status: 'PENDENTE',
    disciplinaId: null,
    criadoEm: '2026-10-31T10:00:00.000Z',
    atualizadoEm: '2026-10-31T10:00:00.000Z',
    concluidaEm: null,
  };

  it('renderiza o título, descrição e rótulo de prioridade em português', () => {
    render(
      <TaskCard
        tarefa={tarefaMock}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Projeto de Redes de Computadores')).toBeInTheDocument();
    expect(screen.getByText('Configurar roteador Cisco')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('dispara onToggleStatus ao clicar no botão de conclusão', () => {
    const handleToggle = vi.fn();
    render(
      <TaskCard
        tarefa={tarefaMock}
        onToggleStatus={handleToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const toggleBtn = screen.getByLabelText(/Marcar .* como concluída/i);
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledWith('task-100');
  });

  it('exibe solicitação de confirmação antes de excluir', () => {
    const handleDelete = vi.fn();
    render(
      <TaskCard
        tarefa={tarefaMock}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByLabelText(/Excluir tarefa/i);
    fireEvent.click(deleteBtn);

    // O prompt de confirmação surge
    expect(screen.getByText('Excluir?')).toBeInTheDocument();
    expect(handleDelete).not.toHaveBeenCalled();

    // Clica no "Sim"
    const confirmBtn = screen.getByLabelText(/Confirmar exclusão/i);
    fireEvent.click(confirmBtn);
    expect(handleDelete).toHaveBeenCalledWith('task-100');
  });
});
