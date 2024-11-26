import { useQuery } from '@tanstack/react-query';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { meetingsApi } from '../services/api';
import { MeetingCard } from '../components/MeetingCard';
import { TodaySchedule } from '../components/meeting/TodaySchedule';
import { useNavigate } from 'react-router-dom';
import { MeetingFormApiData } from '../types/meeting';

export function Home() {
  const navigate = useNavigate();
  
  const { 
    data: meetings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => meetingsApi.getAll(),
  });

  const todayMeetings = (meetings as MeetingFormApiData[]).filter(meeting => 
    isToday(parseISO(meeting.dataHora))
  ).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

  const upcomingMeetings = (meetings as MeetingFormApiData[]).filter(
    meeting => !isToday(parseISO(meeting.dataHora)) && new Date(meeting.dataHora) >= new Date()
  );
  
  const pastMeetings = (meetings as MeetingFormApiData[]).filter(
    meeting => !isToday(parseISO(meeting.dataHora)) && new Date(meeting.dataHora) < new Date()
  );

  const handleEdit = (id: string) => {
    navigate(`/meetings/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      try {
        await meetingsApi.delete(id);
        // Recarregar dados
      } catch (error) {
        console.error('Erro ao excluir reunião:', error);
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/meetings/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reuniões</h1>
        <button
          onClick={() => navigate('/meetings/new')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Nova Reunião
        </button>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Agenda de Hoje
          </h2>
          <span className="text-gray-600">
            {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
        <TodaySchedule
          meetings={todayMeetings}
          isLoading={isLoading}
          error={error as Error}
        /> 
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Próximas Reuniões
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Reuniões Passadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      </section>
    </div>
  );
}