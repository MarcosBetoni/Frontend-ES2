import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MeetingFormApiData } from '../types/meeting';
import { cn } from '../lib/utils';

interface MeetingCardProps {
  meeting: MeetingFormApiData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function MeetingCard({ meeting, onDelete, onView }: MeetingCardProps) {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    scheduled: 'Agendada',
    completed: 'Concluída',
  };

  const handleMeetingStatus = () => {
    if(meeting.dataHora < new Date().toISOString()) {
      return 'completed';
    }
    return 'scheduled';
  }

  console.log(meeting.membrosParticipantes);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{meeting.titulo}</h3>
        <span
          className={cn(
            'px-2 py-1 rounded-full text-sm font-medium',
            statusColors[handleMeetingStatus()]
          )}
        >
          {statusLabels[handleMeetingStatus()]}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Data:</span>{' '}
          {format(new Date(meeting.dataHora), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Local:</span> {meeting.local}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onView(meeting.id)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Visualizar
        </button>
        <button
          onClick={() => onDelete(meeting.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}