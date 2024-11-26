import { MeetingFormApiData } from '../../types/meeting';
import { MeetingDetailsCard } from './MeetingDetailsCard';

interface TodayScheduleProps {
  meetings: MeetingFormApiData[];
  isLoading: boolean;
  error: Error | null;
}

export function TodaySchedule({ meetings, isLoading, error }: TodayScheduleProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-200 h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Erro ao carregar as reuniões: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 text-lg">
          Não há reuniões agendadas para hoje.
        </p>
        <p className="text-gray-500 mt-2">
          Quando houver reuniões programadas, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <MeetingDetailsCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}