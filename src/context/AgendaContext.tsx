'use client';

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Disciplina, NovaDisciplinaInput } from '@/domain/models/disciplina';
import { Tarefa, NovaTarefaInput } from '@/domain/models/tarefa';
import { ConfiguracoesUsuario, CONFIGURACOES_PADRAO } from '@/domain/models/configuracao';
import {
  AgendaStoreState,
  ESTADO_INICIAL_AGENDA,
  IStorageAdapter,
  defaultStorageAdapter,
  StorageWarning,
} from '@/storage/storage-adapter';

// Generate safe unique ID
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

type Action =
  | { type: 'CARREGAR_ESTADO'; payload: AgendaStoreState }
  | { type: 'ADICIONAR_TAREFA'; payload: NovaTarefaInput }
  | { type: 'ATUALIZAR_TAREFA'; payload: Tarefa }
  | { type: 'ALTERNAR_STATUS_TAREFA'; payload: { id: string } }
  | { type: 'EXCLUIR_TAREFA'; payload: { id: string } }
  | { type: 'ADICIONAR_DISCIPLINA'; payload: NovaDisciplinaInput }
  | { type: 'ATUALIZAR_DISCIPLINA'; payload: Disciplina }
  | { type: 'EXCLUIR_DISCIPLINA'; payload: { id: string } }
  | { type: 'ATUALIZAR_CONFIGURACOES'; payload: Partial<ConfiguracoesUsuario> }
  | { type: 'SUBSTITUIR_ESTADO'; payload: AgendaStoreState }
  | { type: 'LIMPAR_AGENDA' };

const agendaReducer = (state: AgendaStoreState, action: Action): AgendaStoreState => {
  const agora = new Date().toISOString();

  switch (action.type) {
    case 'CARREGAR_ESTADO':
    case 'SUBSTITUIR_ESTADO':
      return action.payload;

    case 'ADICIONAR_TAREFA': {
      const novaTarefa: Tarefa = {
        ...action.payload,
        id: generateId(),
        status: 'PENDENTE',
        criadoEm: agora,
        atualizadoEm: agora,
        concluidaEm: null,
      };
      return {
        ...state,
        tarefas: [novaTarefa, ...state.tarefas],
      };
    }

    case 'ATUALIZAR_TAREFA': {
      return {
        ...state,
        tarefas: state.tarefas.map((t) =>
          t.id === action.payload.id ? { ...action.payload, atualizadoEm: agora } : t
        ),
      };
    }

    case 'ALTERNAR_STATUS_TAREFA': {
      return {
        ...state,
        tarefas: state.tarefas.map((t) => {
          if (t.id !== action.payload.id) return t;
          const novoStatus = t.status === 'PENDENTE' ? 'CONCLUIDA' : 'PENDENTE';
          return {
            ...t,
            status: novoStatus,
            atualizadoEm: agora,
            concluidaEm: novoStatus === 'CONCLUIDA' ? agora : null,
          };
        }),
      };
    }

    case 'EXCLUIR_TAREFA': {
      return {
        ...state,
        tarefas: state.tarefas.filter((t) => t.id !== action.payload.id),
      };
    }

    case 'ADICIONAR_DISCIPLINA': {
      const novaDisciplina: Disciplina = {
        ...action.payload,
        id: generateId(),
        criadoEm: agora,
        atualizadoEm: agora,
      };
      return {
        ...state,
        disciplinas: [...state.disciplinas, novaDisciplina],
      };
    }

    case 'ATUALIZAR_DISCIPLINA': {
      return {
        ...state,
        disciplinas: state.disciplinas.map((d) =>
          d.id === action.payload.id ? { ...action.payload, atualizadoEm: agora } : d
        ),
      };
    }

    case 'EXCLUIR_DISCIPLINA': {
      const disciplinaIdExcluida = action.payload.id;
      // Regra constitucional e de especificação: desassociação suave das tarefas
      const tarefasAtualizadas = state.tarefas.map((t) =>
        t.disciplinaId === disciplinaIdExcluida ? { ...t, disciplinaId: null, atualizadoEm: agora } : t
      );

      return {
        ...state,
        disciplinas: state.disciplinas.filter((d) => d.id !== disciplinaIdExcluida),
        tarefas: tarefasAtualizadas,
      };
    }

    case 'ATUALIZAR_CONFIGURACOES': {
      return {
        ...state,
        configuracoes: {
          ...state.configuracoes,
          ...action.payload,
        },
      };
    }

    case 'LIMPAR_AGENDA':
      return {
        versao: 1,
        disciplinas: [],
        tarefas: [],
        configuracoes: CONFIGURACOES_PADRAO,
      };

    default:
      return state;
  }
};

export interface AgendaContextValue {
  state: AgendaStoreState;
  isLoading: boolean;
  storageWarning: StorageWarning | null;
  adicionarTarefa: (tarefa: NovaTarefaInput) => void;
  atualizarTarefa: (tarefa: Tarefa) => void;
  alternarStatusTarefa: (id: string) => void;
  excluirTarefa: (id: string) => void;
  adicionarDisciplina: (disciplina: NovaDisciplinaInput) => void;
  atualizarDisciplina: (disciplina: Disciplina) => void;
  excluirDisciplina: (id: string) => void;
  atualizarConfiguracoes: (config: Partial<ConfiguracoesUsuario>) => void;
  restaurarBackup: (novoEstado: AgendaStoreState) => void;
  limparAgenda: () => void;
}

export const AgendaContext = createContext<AgendaContextValue | null>(null);

export interface AgendaProviderProps {
  children: React.ReactNode;
  storageAdapter?: IStorageAdapter;
  initialState?: AgendaStoreState;
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({
  children,
  storageAdapter = defaultStorageAdapter,
  initialState,
}) => {
  const [state, dispatch] = useReducer(agendaReducer, initialState || ESTADO_INICIAL_AGENDA);
  const [isLoading, setIsLoading] = useState(!initialState);
  const [storageWarning, setStorageWarning] = useState<StorageWarning | null>(
    storageAdapter.getWarning()
  );

  // Carrega estado do storage ao inicializar
  useEffect(() => {
    if (!initialState) {
      const estadoCarregado = storageAdapter.load();
      dispatch({ type: 'CARREGAR_ESTADO', payload: estadoCarregado });
      setStorageWarning(storageAdapter.getWarning());
      setIsLoading(false);
    }
  }, [storageAdapter, initialState]);

  // Salva no storage quando o estado for alterado (após carregamento inicial)
  useEffect(() => {
    if (!isLoading) {
      storageAdapter.save(state);
      setStorageWarning(storageAdapter.getWarning());
    }
  }, [state, isLoading, storageAdapter]);

  const value: AgendaContextValue = {
    state,
    isLoading,
    storageWarning,
    adicionarTarefa: (tarefa) => dispatch({ type: 'ADICIONAR_TAREFA', payload: tarefa }),
    atualizarTarefa: (tarefa) => dispatch({ type: 'ATUALIZAR_TAREFA', payload: tarefa }),
    alternarStatusTarefa: (id) => dispatch({ type: 'ALTERNAR_STATUS_TAREFA', payload: { id } }),
    excluirTarefa: (id) => dispatch({ type: 'EXCLUIR_TAREFA', payload: { id } }),
    adicionarDisciplina: (disciplina) =>
      dispatch({ type: 'ADICIONAR_DISCIPLINA', payload: disciplina }),
    atualizarDisciplina: (disciplina) =>
      dispatch({ type: 'ATUALIZAR_DISCIPLINA', payload: disciplina }),
    excluirDisciplina: (id) => dispatch({ type: 'EXCLUIR_DISCIPLINA', payload: { id } }),
    atualizarConfiguracoes: (config) =>
      dispatch({ type: 'ATUALIZAR_CONFIGURACOES', payload: config }),
    restaurarBackup: (novoEstado) =>
      dispatch({ type: 'SUBSTITUIR_ESTADO', payload: novoEstado }),
    limparAgenda: () => dispatch({ type: 'LIMPAR_AGENDA' }),
  };

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
};
