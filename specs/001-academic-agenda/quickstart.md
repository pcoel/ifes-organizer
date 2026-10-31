# Quickstart & Validation Guide: AgendaIFES MVP

**Feature**: `001-academic-agenda`  
**Date**: 2026-10-31  
**Status**: Ready for Execution  

---

## 1. Prerequisites

- **Node.js**: v18.17+ ou v20+ LTS
- **Gerenciador de Pacotes**: `npm` v9+
- **Navegador**: Qualquer navegador moderno (Chrome, Firefox, Safari, Edge) com suporte a `localStorage`.

---

## 2. Environment Setup & Execution Commands

### 2.1 Instalação e Execução em Desenvolvimento

```bash
# Instalar dependências do projeto
npm install

# Iniciar servidor de desenvolvimento local
npm run dev
# Acesse: http://localhost:3000
```

### 2.2 Verificação de Qualidade e Testes Automatizados

```bash
# Executar a suíte de testes unitários e de integração (Vitest)
npm test

# Executar verificação de tipos estáticos do TypeScript
npm run typecheck

# Executar análise estática de código (ESLint)
npm run lint

# Gerar build de produção estático (Static Export)
npm run build
```

---

## 3. End-to-End Validation Scenarios

Os cenários abaixo cobrem os critérios de aceitação e fluxos principais descritos em [spec.md](./spec.md) e nos contratos em [contracts/](./contracts/):

### Cenário 1: Cadastro de Disciplina e Docente (User Story 2)
1. **Ação**: Acesse a aba/seção "Disciplinas" e clique em "Nova Disciplina".
2. **Dados de Teste**:
   - Nome: `Programação Web`
   - Professor: `Prof. Roberto`
   - Sala: `Lab 3 - Bloco B`
   - Cor: `#006633` (Verde IFES)
3. **Resultado Esperado**: A disciplina aparece na listagem com a cor associada e fica disponível no seletor de matérias do formulário de tarefas.

### Cenário 2: Criação, Priorização e Conclusão de Tarefa (User Story 1)
1. **Ação**: Clique em "Nova Tarefa".
2. **Dados de Teste**:
   - Título: `Projeto Final - Etapa 1`
   - Disciplina: `Programação Web`
   - Prazo: Definir para amanhã às `23:59`
   - Prioridade: `Alta`
3. **Resultado Esperado**:
   - A tarefa é exibida no topo da lista com selo vermelho/alerta de prioridade alta.
   - O badge da disciplina exibe a cor `#006633`.
   - Ao marcar a caixa de seleção de conclusão, a tarefa é riscada/concluída e a contagem de pendências do cabeçalho diminui em 1.

### Cenário 3: Alerta de Urgência / Vencimento
1. **Ação**: Crie uma tarefa com prazo configurado para 2 horas no futuro.
2. **Resultado Esperado**: A tarefa é destacada com o status `URGENTE` e badge de contagem regressiva em destaque amarelo/laranja.

### Cenário 4: Exportação e Restauração de Backup JSON (User Story 3)
1. **Ação (Exportar)**: Clique em "Configurações" > "Exportar Backup".
2. **Resultado Esperado**: O navegador baixa um arquivo `agenda-ifes-backup-[DATA].json` em conformidade com o [backup-schema.contract.json](./contracts/backup-schema.contract.json).
3. **Ação (Limpar e Restaurar)**:
   - Abra o console do navegador e execute `localStorage.clear()`, em seguida recarregue a página (a agenda estará vazia).
   - Clique em "Restaurar Backup" e selecione o arquivo baixado.
4. **Resultado Esperado**:
   - O modal exibe resumo dos dados encontrados no arquivo (ex.: 1 disciplina, 2 tarefas).
   - Após confirmação, todos os registros reaparecem instantaneamente na interface sem perda ou corrupção.

### Cenário 5: Rejeição de Backup Inválido
1. **Ação**: Tente restaurar um arquivo `.json` com formato incorreto (ex.: `{ "foo": "bar" }`).
2. **Resultado Esperado**: O sistema bloqueia a importação, exibe mensagem clara de erro de esquema Zod e preserva o estado local intacto.
