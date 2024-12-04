import axios from 'axios';
import { Meeting, MeetingFormApiData, Member, Participante } from '../types/meeting';
import { set } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

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
      const { data } = await api.get('/api/reuniao/listar', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return data;
    } catch {
      throw new Error('Erro ao buscar reuniões');
    }
  },

  getById: async (id: string): Promise<MeetingFormApiData> => {
    try{
      const { data } = await api.get(`/api/reuniao/detalhes/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return data;
    } catch {
      throw new Error('Erro ao buscar reunião');
    }
  },

  create: async (meeting: Omit<MeetingFormApiData, 'id'>): Promise<MeetingFormApiData> => {
    const { data } = await api.post('/api/reuniao', meeting, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  },

  addMinutes: async (id: string, senha: string, ata: string): Promise<MeetingFormApiData> => {
    try {
      const {data} = await api.put(`/api/reuniao/adicionar-ata/${id}`, {
        senha,
        ata
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return data;
    } catch {
      throw new Error('Erro ao adicionar ata');
    }
  },



  update: async (id: string, meeting: Partial<MeetingFormApiData>): Promise<MeetingFormApiData> => {
    // remove ids from agenda
    const meetingUpdate = {
      ...meeting,
      pautas: meeting.pautas?.map(pauta => ({
        titulo: pauta.titulo,
        descricao: pauta.descricao
      }))
    };

    try {
      const {data} = await api.put(`/api/reuniao/${id}`, meetingUpdate, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return data;
    } catch {
      throw new Error('Erro ao atualizar reunião');
    }
  },

  markAttendance: async (id: string, participantes: Participante[]): Promise<void> => {
    try {
      await api.put(`/api/reuniao/marcar-presenca/${id}`, {
        participantes
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch {
      throw new Error('Erro ao marcar presença');
    }
  }

};

export const membersApi = {
  getAll: async (): Promise<Member[]> => {
    try {
      const { data } = await api.get('/api/usuario/listar', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
    console.log(member);
    const user = {
      nome: member.name,
      email: member.email,
      senha: member.password,
      tipoUsuario: member.role
    }
    const { data } = await api.put(`/api/usuario/${id}`, user, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
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

      localStorage.setItem('token', data.token);
      const decodedToken = jwtDecode(data.token);
      console.log(decodedToken);
      localStorage.setItem('user', JSON.stringify(decodedToken));
    } catch {
      throw new Error('Credenciais inválidas');
    }
  }

};