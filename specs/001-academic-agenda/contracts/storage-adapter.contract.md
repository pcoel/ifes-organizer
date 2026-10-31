# Contract: Storage Adapter Interface

**Feature**: `001-academic-agenda`  
**Target**: Client-Side Persistence Layer  
**Language/Runtime**: TypeScript / Browser Web APIs  

---

## 1. Overview

O `IStorageAdapter` abstrai toda a interação de persistência com o navegador. Essa interface isola os componentes de interface (React) e os serviços de domínio dos detalhes de implementação do `window.localStorage`, permitindo testes unitários limpos com mocks em memória e futura substituição por IndexedDB/OPFS.

---

## 2. Interface Definition

```typescript
export interface AgendaStoreState {
  versao: number;
  disciplinas: Disciplina[];
  tarefas: Tarefa[];
  configuracoes: ConfiguracoesUsuario;
}

export type StorageErrorType = 
  | 'QUOTA_EXCEEDED'
  | 'STORAGE_DISABLED'
  | 'CORRUPTED_DATA'
  | 'UNKNOWN_ERROR';

export interface StorageError {
  type: StorageErrorType;
  message: string;
  originalError?: unknown;
}

export interface IStorageAdapter {
  /**
   * Carrega o estado completo salvo no armazenamento local.
   * Se não houver dados, retorna o estado inicial vazio pré-definido.
   * Lança StorageError em caso de dados corrompidos não recuperáveis.
   */
  load(): Promise<AgendaStoreState> | AgendaStoreState;

  /**
   * Salva o estado completo no armazenamento local.
   * Lança StorageError se a cota do navegador for excedida ou o armazenamento estiver bloqueado.
   */
  save(state: AgendaStoreState): Promise<void> | void;

  /**
   * Limpa todos os dados salvos sob o namespace da aplicação.
   */
  clear(): Promise<void> | void;

  /**
   * Verifica se o mecanismo de armazenamento está disponível e com permissão de escrita.
   */
  isAvailable(): boolean;
}
```

---

## 3. Behavioral Guarantees

1. **Namespace Isolation**:
   - Todas as chaves utilizadas DEVEM ser prefixadas com `agenda_ifes_v1_`.
2. **Graceful Degradation**:
   - Se `window.localStorage` não estiver acessível (ex: navegação anônima com bloqueio de cookies/storage), o adaptador DEVE alternar para um armazenamento em memória temporário durante a sessão e emitir um aviso informativo para a interface.
3. **Atomic Writes**:
   - As escritas do estado completo DEVEM ser atômicas via serialização única em string JSON, impedindo estados parciais inconsistentes.
4. **Data Corruption Recovery**:
   - Se os dados existentes no storage falharem na validação do Zod durante o `load()`, o adaptador DEVE preservar o conteúdo bruto corrompido em uma chave de recuperação (`agenda_ifes_v1_corrupted_[timestamp]`) antes de inicializar um estado seguro vazio, prevenindo perda catastrófica e permitindo inspeção manual.
