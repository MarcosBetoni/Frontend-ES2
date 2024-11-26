import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { MeetingFormApiData } from '../../types/meeting';
import { cn } from '../../lib/utils';

interface MeetingDetailsCardProps {
  meeting: MeetingFormApiData;
}

export function MeetingDetailsCard({ meeting }: MeetingDetailsCardProps) {
  const navigate = useNavigate();

  const formattedTime = format(new Date(meeting.dataHora), 'HH:mm', { locale: ptBR });

  return (
    <div
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{meeting.titulo}</h3>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{formattedTime}</span> - {meeting.local}
          </p>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          'bg-blue-100 text-blue-800'
        )}>
          Hoje
        </span>
      </div>

      <div className="space-y-3">

        
      </div>
    </div>
  );
}