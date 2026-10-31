import { Disciplina } from '@/domain/models/disciplina';
import { Tarefa } from '@/domain/models/tarefa';

export function obterDadosIniciaisExemplo(): {
  disciplinas: Disciplina[];
  tarefas: Tarefa[];
} {
  const agora = new Date();
  const amanha = new Date(agora);
  amanha.setDate(agora.getDate() + 1);

  const semanaQueVem = new Date(agora);
  semanaQueVem.setDate(agora.getDate() + 7);

  const disciplinaExemplo: Disciplina = {
    id: 'seed-disc-progweb',
    nome: 'Programação Web',
    professor: 'Prof. Roberto',
    sala: 'Lab 3 - Bloco B',
    cor: '#006633',
    criadoEm: agora.toISOString(),
    atualizadoEm: agora.toISOString(),
  };

  const tarefasExemplo: Tarefa[] = [
    {
      id: 'seed-task-bemvindo',
      titulo: 'Explorar os recursos do AgendaIFES Campus Serra',
      descricao:
        'Bem-vindo(a) ao seu organizador acadêmico! Adicione suas disciplinas, tarefas e prazos. Você também pode exportar backups em JSON a qualquer momento.',
      dataEntrega: `${amanha.toISOString().slice(0, 10)}T23:59`,
      prioridade: 'ALTA',
      status: 'PENDENTE',
      disciplinaId: 'seed-disc-progweb',
      criadoEm: agora.toISOString(),
      atualizadoEm: agora.toISOString(),
      concluidaEm: null,
    },
    {
      id: 'seed-task-projeto',
      titulo: 'Entrega do Projeto Final - Etapa 1',
      descricao: 'Especificação técnica e protótipo de telas',
      dataEntrega: `${semanaQueVem.toISOString().slice(0, 10)}T18:00`,
      prioridade: 'MEDIA',
      status: 'PENDENTE',
      disciplinaId: 'seed-disc-progweb',
      criadoEm: agora.toISOString(),
      atualizadoEm: agora.toISOString(),
      concluidaEm: null,
    },
  ];

  return {
    disciplinas: [disciplinaExemplo],
    tarefas: tarefasExemplo,
  };
}
