import { useState } from 'react';
import { MembrosParticipantes } from '../../types/meeting';
import { isToday, parseISO } from 'date-fns';

interface AttendanceSectionProps {
  attendees: MembrosParticipantes[];
  meetingDate: string;
  onAttendanceChange: (attendeeIds: string[]) => void;
}

export function AttendanceSection({
  attendees,
  meetingDate,
  onAttendanceChange,
}: AttendanceSectionProps) {
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const isEditable = isToday(parseISO(meetingDate));

  const handleToggleAttendee = (id: string) => {
    if (!isEditable) return;
    
    const newSelectedAttendees = selectedAttendees.includes(id)
      ? selectedAttendees.filter((attendeeId) => attendeeId !== id)
      : [...selectedAttendees, id];

    setSelectedAttendees(newSelectedAttendees);
    onAttendanceChange(newSelectedAttendees);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Presença</h2>
        {!isEditable && (
          <span className="text-sm text-gray-500">
            Disponível apenas para reuniões de hoje
          </span>
        )}
      </div>
      <div className="space-y-2">
        {attendees.map((attendee) => (
          <label
            key={attendee.id}
            className={`flex items-center p-3 bg-gray-50 rounded-lg ${
              isEditable ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed opacity-75'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedAttendees.includes(attendee.id)}
              onChange={() => handleToggleAttendee(attendee.id)}
              disabled={!isEditable}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <div className="ml-3">
              <p className="font-medium">{attendee.nome}</p>
              <p className="text-sm text-gray-600">{attendee.email}</p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}