import axios from 'axios';
import { Meeting, MeetingFormApiData, Member } from '../types/meeting';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Helper function to get today's date at a specific time
const getTodayAt = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// export const mockMeetings: Meeting[] = [
//   {
//     id: '1',
//     title: 'Reunião de Planejamento Estratégico',
//     date: '2024-03-25T14:00:00',
//     location: 'Sala de Conferência A',
//     status: 'scheduled',
//     agendas: [
//       {
//         id: '1',
//         title: 'Revisão de Metas Q1',
//         description: 'Análise do desempenho e resultados do primeiro trimestre',
//         order: 1,
//       },
//       {
//         id: '2',
//         title: 'Planejamento Q2',
//         description: 'Definição de objetivos e estratégias para o próximo trimestre',
//         order: 2,
//       },
//     ],
//     attendees: [
//       {
//         id: '1',
//         name: 'João Silva',
//         email: 'joao@exemplo.com',
//       },
//       {
//         id: '2',
//         name: 'Maria Santos',
//         email: 'maria@exemplo.com',
//       },
//     ],
//   },
//   {
//     id: '2',
//     title: 'Retrospectiva de Projeto',
//     date: '2024-03-20T10:00:00',
//     location: 'Sala Virtual (Google Meet)',
//     status: 'completed',
//     agendas: [
//       {
//         id: '3',
//         title: 'Análise de Resultados',
//         description: 'Avaliação dos objetivos alcançados',
//         order: 1,
//       },
//     ],
//     attendees: [
//       {
//         id: '1',
//         name: 'João Silva',
//         email: 'joao@exemplo.com',
//       },
//     ],
//     minutes: {
//       id: '1',
//       content: 'Durante a reunião, foram discutidos os principais pontos do projeto...',
//       createdAt: '2024-03-20T12:00:00',
//       updatedAt: '2024-03-20T12:00:00',
//     },
//   },
//   // Reunião de hoje para demonstração
//   {
//     id: '3',
//     title: 'Reunião de Alinhamento Semanal',
//     date: getTodayAt(14, 30),
//     location: 'Sala de Reuniões Principal',
//     status: 'scheduled',
//     agendas: [
//       {
//         id: '4',
//         title: 'Atualizações dos Times',
//         description: 'Cada líder de equipe apresentará o progresso semanal',
//         order: 1,
//       },
//       {
//         id: '5',
//         title: 'Próximos Passos',
//         description: 'Definição das prioridades para a próxima semana',
//         order: 2,
//       },
//       {
//         id: '6',
//         title: 'Pontos de Atenção',
//         description: 'Discussão sobre desafios e bloqueios atuais',
//         order: 3,
//       }
//     ],
//     attendees: [
//       {
//         id: '1',
//         name: 'João Silva',
//         email: 'joao@exemplo.com',
//       },
//       {
//         id: '2',
//         name: 'Maria Santos',
//         email: 'maria@exemplo.com',
//       },
//       {
//         id: '3',
//         name: 'Pedro Oliveira',
//         email: 'pedro@exemplo.com',
//       },
//       {
//         id: '4',
//         name: 'Ana Costa',
//         email: 'ana@exemplo.com',
//       }
//     ],
//   },
// ];

export const meetingsApi = {
  getAll: async (): Promise<MeetingFormApiData[]> => {
    try {
      const { data } = await api.get('/api/reuniao/listar');
      return data;
    } catch {
      throw new Error('Erro ao buscar reuniões');
    }
  },

  getById: async (id: string): Promise<MeetingFormApiData> => {
    // For development, find meeting in mock data
    try{
      const { data } = await api.get(`/api/reuniao/detalhes/${id}`);
      return data;
    } catch {
      throw new Error('Erro ao buscar reunião');
    }
  },

  create: async (meeting: Omit<MeetingFormApiData, 'id'>): Promise<MeetingFormApiData> => {
    const { data } = await api.post('/api/reuniao', meeting);
    return data;
  },

  update: async (id: string, meeting: Partial<Meeting>): Promise<Meeting> => {
    const { data } = await api.put(`/meetings/${id}`, meeting);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },
};

export const membersApi = {
  getAll: async (): Promise<Member[]> => {
    try {
      const { data } = await api.get('/api/usuario/listar');
      console.log(data);
      return data;
    } catch {
      throw new Error('Erro ao buscar membros');
    }
  },

  create: async (member: Omit<Member, 'id' | 'tipoUsuario'>): Promise<Member> => {
    const { data } = await api.post('/api/usuario', member, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log(data);
    return data;
  },

  update: async (id: string, member: Partial<Member>): Promise<Member> => {
    const { data } = await api.put(`/members/${id}`, member);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  login: async (email: string, senha: string): Promise<void> => {
    try {
      localStorage.removeItem('token');
      const { data } = await api.post('/auth/login', { email, senha }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch {
      throw new Error('Credenciais inválidas');
    }
  }

};