import { z } from 'zod';
import { DisciplinaSchema } from '@/domain/models/disciplina';
import { TarefaSchema } from '@/domain/models/tarefa';
import { ConfiguracoesSchema, CONFIGURACOES_PADRAO } from '@/domain/models/configuracao';
import { STORAGE_KEYS } from './storage-keys';

export const AgendaStoreStateSchema = z.object({
  versao: z.number().default(1),
  disciplinas: z.array(DisciplinaSchema).default([]),
  tarefas: z.array(TarefaSchema).default([]),
  configuracoes: ConfiguracoesSchema.default(CONFIGURACOES_PADRAO),
});

export type AgendaStoreState = z.infer<typeof AgendaStoreStateSchema>;

export const ESTADO_INICIAL_AGENDA: AgendaStoreState = {
  versao: STORAGE_KEYS.VERSION,
  disciplinas: [],
  tarefas: [],
  configuracoes: CONFIGURACOES_PADRAO,
};

export type StorageErrorType =
  | 'QUOTA_EXCEEDED'
  | 'STORAGE_DISABLED'
  | 'CORRUPTED_DATA'
  | 'UNKNOWN_ERROR';

export interface StorageWarning {
  type: StorageErrorType;
  message: string;
}

export interface IStorageAdapter {
  load(): AgendaStoreState;
  save(state: AgendaStoreState): void;
  clear(): void;
  isAvailable(): boolean;
  getWarning(): StorageWarning | null;
}

export class LocalStorageAdapter implements IStorageAdapter {
  private memoryStore: Record<string, string> = {};
  private isMemoryFallback = false;
  private currentWarning: StorageWarning | null = null;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.enableMemoryFallback(
        'Armazenamento local indisponível no ambiente. Os dados serão mantidos apenas em memória temporária.'
      );
      return false;
    }

    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      this.isMemoryFallback = false;
      return true;
    } catch {
      this.enableMemoryFallback(
        'O armazenamento local está bloqueado ou sem permissão. Os dados não persistirão ao fechar o navegador.'
      );
      return false;
    }
  }

  private enableMemoryFallback(message: string): void {
    this.isMemoryFallback = true;
    this.currentWarning = {
      type: 'STORAGE_DISABLED',
      message,
    };
  }

  public isAvailable(): boolean {
    return !this.isMemoryFallback;
  }

  public getWarning(): StorageWarning | null {
    return this.currentWarning;
  }

  public load(): AgendaStoreState {
    try {
      let rawData: string | null = null;

      if (this.isMemoryFallback) {
        rawData = this.memoryStore[STORAGE_KEYS.MAIN_STORE] || null;
      } else {
        rawData = window.localStorage.getItem(STORAGE_KEYS.MAIN_STORE);
      }

      if (!rawData) {
        return { ...ESTADO_INICIAL_AGENDA };
      }

      const parsedJson = JSON.parse(rawData);
      const validationResult = AgendaStoreStateSchema.safeParse(parsedJson);

      if (!validationResult.success) {
        // Salvaguarda: preserva o conteúdo corrompido em chave isolada
        const recoveryKey = `${STORAGE_KEYS.CORRUPTED_PREFIX}${Date.now()}`;
        if (!this.isMemoryFallback) {
          try {
            window.localStorage.setItem(recoveryKey, rawData);
          } catch {
            // Silencioso se cota falhar no backup de corrompidos
          }
        }

        this.currentWarning = {
          type: 'CORRUPTED_DATA',
          message:
            'Dados locais corrompidos ou incompatíveis detectados. Uma cópia de segurança foi preservada e a agenda foi reinicializada com segurança.',
        };

        return { ...ESTADO_INICIAL_AGENDA };
      }

      return validationResult.data;
    } catch {
      this.currentWarning = {
        type: 'CORRUPTED_DATA',
        message: 'Falha ao ler dados locais. A agenda foi reinicializada no estado seguro.',
      };
      return { ...ESTADO_INICIAL_AGENDA };
    }
  }

  public save(state: AgendaStoreState): void {
    // Validação rigorosa com Zod antes de persistir
    const validatedState = AgendaStoreStateSchema.parse(state);
    const serialized = JSON.stringify(validatedState);

    if (this.isMemoryFallback) {
      this.memoryStore[STORAGE_KEYS.MAIN_STORE] = serialized;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEYS.MAIN_STORE, serialized);
      if (this.currentWarning?.type === 'QUOTA_EXCEEDED') {
        this.currentWarning = null;
      }
    } catch (err: unknown) {
      const isQuota =
        err instanceof DOMException &&
        (err.code === 22 ||
          err.code === 1014 ||
          err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

      if (isQuota) {
        this.currentWarning = {
          type: 'QUOTA_EXCEEDED',
          message:
            'A cota de armazenamento local do navegador foi excedida. Exporte um backup e remova tarefas antigas para liberar espaço.',
        };
        // Alterna temporariamente para guardar na memória para não perder a alteração imediata da tela
        this.memoryStore[STORAGE_KEYS.MAIN_STORE] = serialized;
      } else {
        throw err;
      }
    }
  }

  public clear(): void {
    this.memoryStore = {};
    if (!this.isMemoryFallback && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.MAIN_STORE);
    }
  }
}

export const defaultStorageAdapter = new LocalStorageAdapter();
