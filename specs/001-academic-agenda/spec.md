# Feature Specification: Agenda Acadêmica para Estudantes do IFES Campus Serra

**Feature Branch**: `001-academic-agenda`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Sistema web de organização acadêmica voltado principalmente para estudantes do IFES Campus Serra. O objetivo é centralizar disciplinas, professores, tarefas, trabalhos, prazos e prioridades em uma agenda simples e intuitiva. A primeira versão será destinada ao uso individual do estudante, com armazenamento local dos dados, sem contas de usuário ou backend. O sistema deverá priorizar a organização das atividades acadêmicas, a persistência dos dados no navegador e a possibilidade de importar e exportar backups em JSON."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestão e Acompanhamento de Tarefas e Prazos (Priority: P1)

Como estudante do IFES Campus Serra, quero registrar minhas tarefas, trabalhos, listas de exercícios e datas de provas com prazos e prioridades, para que eu possa acompanhar claramente o que preciso entregar e quando, evitando esquecimentos e atrasos.

**Why this priority**: É a funcionalidade central e o valor imediato do produto. Mesmo sem cadastro detalhado de disciplinas ou exportação avançada, poder criar e concluir tarefas com prazos e prioridades já resolve a dor principal de organização do estudante.

**Independent Test**: Pode ser testado de forma totalmente autônoma criando tarefas com diferentes datas de entrega e níveis de prioridade (Alta, Média, Baixa), marcando tarefas como concluídas, e verificando se a lista ordena as entregas mais próximas primeiro e filtra tarefas por status (pendentes/concluídas).

**Acceptance Scenarios**:

1. **Given** que o estudante está na tela principal de tarefas, **When** preenche título ("Relatório de Física"), prazo limite ("2026-11-05 23:59") e prioridade ("Alta") e clica em salvar, **Then** a tarefa é exibida na lista de pendências com destaque de urgência adequado.
2. **Given** uma lista de tarefas cadastradas com diferentes prazos, **When** o estudante visualiza sua agenda, **Then** as tarefas são exibidas ordenadas cronologicamente da mais urgente para a mais distante.
3. **Given** uma tarefa com status pendente, **When** o estudante marca a caixa de seleção de conclusão, **Then** a tarefa é atualizada visualmente para concluída e removida da contagem de pendências imediatas.
4. **Given** uma tarefa cadastrada incorretamente, **When** o estudante aciona a ação de editar ou excluir, **Then** a tarefa reflete as novas informações atualizadas ou é removida permanentemente após confirmação.

---

### User Story 2 - Cadastro e Associação de Disciplinas e Professores (Priority: P2)

Como estudante, quero cadastrar minhas disciplinas do semestre (com nome do professor, sala/laboratório e identificador de cor) e vincular minhas tarefas a essas disciplinas, para que eu tenha uma visão contextualizada e possa filtrar compromissos por matéria específica.

**Why this priority**: A vida acadêmica no IFES é organizada por disciplinas e professores. Essa capacidade enriquece a visualização e permite ao estudante focar no que deve entregar para cada professor ou matéria.

**Independent Test**: Pode ser testado cadastrando duas disciplinas com nomes de professores distintos e cores de destaque, criando tarefas vinculadas a cada uma e aplicando filtros por disciplina para isolar as demandas de cada matéria.

**Acceptance Scenarios**:

1. **Given** que o estudante acessa a seção de disciplinas, **When** informa nome da disciplina ("Programação Web"), nome do professor ("Prof. Silva") e seleciona uma cor, **Then** a disciplina é salva e disponibilizada para seleção em novas tarefas.
2. **Given** disciplinas existentes cadastradas, **When** o estudante cria ou edita uma tarefa e seleciona a disciplina vinculada, **Then** a tarefa exibe a etiqueta com o nome e a cor da matéria na lista geral.
3. **Given** uma lista de tarefas de diferentes disciplinas, **When** o estudante seleciona o filtro por uma disciplina específica, **Then** apenas as tarefas associadas àquela matéria são apresentadas na listagem.
4. **Given** uma disciplina cadastrada que possui tarefas atreladas, **When** o estudante tenta excluir a disciplina, **Then** o sistema alerta sobre a existência de tarefas vinculadas e solicita confirmação sobre manter as tarefas desvinculadas ou cancelar a ação.

---

### User Story 3 - Persistência Local e Backup / Restauração de Dados (Priority: P3)

Como estudante que utiliza o sistema sem cadastro em nuvem, quero que meus dados permaneçam salvos no meu navegador entre sessões e que eu possa gerar e importar cópias de segurança em arquivos de formato padrão, para que eu possa transferir minha agenda para outros dispositivos ou restaurá-la caso limpe os dados do navegador.

**Why this priority**: Garante a confiabilidade, a retenção dos dados e a portabilidade das informações sem depender de infraestrutura externa ou violar a privacidade do estudante.

**Independent Test**: Pode ser testado cadastrando disciplinas e tarefas, executando a exportação de um arquivo de backup, simulando uma limpeza dos dados da aplicação, importando o arquivo gerado e confirmando que todas as disciplinas, professores e tarefas foram integralmente restaurados.

**Acceptance Scenarios**:

1. **Given** que o estudante adicionou tarefas e disciplinas, **When** recarrega a página ou fecha e reabre o navegador, **Then** todos os registros continuam presentes exatamente no mesmo estado.
2. **Given** uma base de dados ativa com disciplinas e tarefas, **When** o estudante clica em "Exportar Backup", **Then** um arquivo contendo todas as informações estruturadas é baixado imediatamente para o dispositivo do usuário com carimbo de data/hora no nome do arquivo.
3. **Given** um arquivo de backup válido gerado anteriormente, **When** o estudante faz o upload na opção "Restaurar Backup" e confirma a sobreposição, **Then** todos os dados são validados e carregados com sucesso, atualizando imediatamente a interface.
4. **Given** um arquivo corrompido, vazio ou em formato inválido submetido na restauração, **When** o estudante tenta importar, **Then** o sistema rejeita a operação, exibe uma mensagem de erro clara informando a incompatibilidade e preserva os dados existentes sem corrompê-los.

---

### Edge Cases

- **Prazos Vencidos**: Tarefas com prazo anterior ao momento atual devem ser marcadas com indicador visual explícito de atraso (ex.: alerta em vermelho), mantendo-se acessíveis para conclusão ou reagendamento.
- **Datas Limítrofes e Fusos**: Prazos definidos para o final do dia (23:59) ou virada de semestre devem respeitar o fuso horário local do dispositivo sem defasagem de dias.
- **Armazenamento Local Cheio ou Bloqueado**: Se o armazenamento local do navegador estiver indisponível (modo anônimo restritivo ou cota esgotada), o sistema deve alertar o usuário de que as alterações da sessão atual não persistirão após o fechamento da aba.
- **Importação de Backup Vazio ou Incompatível**: Caso o usuário importe um arquivo que não contenha a estrutura necessária, a validação deve interromper a importação antes de qualquer mutação nos dados locais.
- **Nomes Longos e Caracteres Especiais**: Nomes extensos de tarefas, disciplinas ou professores não devem quebrar o layout em telas de smartphones.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir criar, editar, listar e excluir tarefas acadêmicas com título, descrição opcional, data/hora de entrega, nível de prioridade (Baixa, Média, Alta) e disciplina associada opcional.
- **FR-002**: O sistema DEVE permitir alternar o status de uma tarefa entre pendente e concluída com um único toque/clique.
- **FR-003**: O sistema DEVE ordenar as tarefas pendentes automaticamente por proximidade do prazo de entrega por padrão.
- **FR-004**: O sistema DEVE disponibilizar filtros por status (Todas, Pendentes, Concluídas), por nível de prioridade e por disciplina.
- **FR-005**: O sistema DEVE permitir o cadastro, edição, listagem e remoção de disciplinas, contendo obrigatoriamente nome da matéria e opcionalmente nome do professor, sala/local e cor de identificação.
- **FR-006**: O sistema DEVE persistir todas as informações de tarefas, disciplinas e configurações no armazenamento local do navegador de forma transparente a cada alteração.
- **FR-007**: O sistema DEVE permitir ao usuário baixar a qualquer momento um arquivo de backup completo em formato estruturado (JSON) com todos os seus registros.
- **FR-008**: O sistema DEVE permitir a importação de um arquivo de backup previamente gerado, validando a integridade e o formato dos dados antes de substituir ou atualizar a base local.
- **FR-009**: O sistema DEVE solicitar confirmação explícita do usuário antes de sobrescrever dados existentes durante uma restauração de backup ou exclusão de registros.
- **FR-010**: O sistema DEVE alertar visualmente o usuário quando uma tarefa estiver próxima do vencimento (menos de 24 horas) ou já estiver vencida.
- **FR-011**: O sistema DEVE ser totalmente utilizável sem conexão com a internet após o carregamento inicial da página.
- **FR-012**: O sistema DEVE operar sem exigir cadastro de conta, login ou envio de dados para servidores externos.

### Key Entities

- **Tarefa (Task)**: Representa uma atividade acadêmica do estudante. Atributos conceituais: identificador único, título, descrição detalhada, data e hora de vencimento, prioridade (Baixa, Média, Alta), status (Pendente, Concluída), data de criação, data de conclusão e referência à Disciplina vinculada.
- **Disciplina (Course/Subject)**: Representa uma matéria cursada no período letivo. Atributos conceituais: identificador único, nome da disciplina, nome do docente responsável, sala/laboratório habitual, cor identificadora e data de cadastro.
- **Pacote de Backup (Backup Package)**: Representa a fotografia completa dos dados do estudante em determinado momento para fins de portabilidade e segurança. Atributos conceituais: versão do formato de dados, data e hora da geração do backup e coleções de tarefas e disciplinas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O estudante consegue registrar uma nova tarefa completa (título, prazo e prioridade) em menos de 15 segundos.
- **SC-002**: O estudante consegue localizar e marcar uma tarefa como concluída em menos de 5 segundos a partir da tela inicial.
- **SC-003**: O processo de exportação do arquivo de backup é concluído em menos de 2 segundos com um único clique.
- **SC-004**: 100% dos dados válidos exportados em um dispositivo são restaurados com fidelidade exata ao serem importados em outro navegador.
- **SC-005**: 100% das operações de cadastro, edição, listagem e busca funcionam de forma fluida sem requisições de rede ou dependência de conectividade após a carga da página.
- **SC-006**: Zero dados pessoais ou acadêmicos do estudante são transmitidos para terceiros ou servidores remotos.

## Assumptions

- O uso do aplicativo é individual e exclusivo por navegador/dispositivo na versão MVP, sem sincronização concorrente em tempo real entre múltiplos aparelhos.
- Os navegadores utilizados pelos estudantes possuem suporte a armazenamento local padrão com capacidade suficiente para milhares de registros textuais.
- Ao excluir uma disciplina que possua tarefas atreladas, as tarefas correspondentes permanecerão salvas, tendo apenas seu vínculo com a disciplina removido (passando a tarefas sem disciplina definida), a menos que o usuário decida excluí-las individualmente.
- Ao restaurar um arquivo de backup, o comportamento padrão após confirmação explícita do usuário é a substituição integral do estado local pelo conteúdo do arquivo de backup para evitar inconsistências de duplicação.
