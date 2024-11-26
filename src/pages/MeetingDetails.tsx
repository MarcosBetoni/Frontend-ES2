import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// import { isToday, parseISO } from 'date-fns';
import { meetingsApi } from '../services/api';
import { MeetingFormApiData } from '../types/meeting';
import { MeetingHeader } from '../components/meeting/MeetingHeader';
import { MeetingAgenda } from '../components/meeting/MeetingAgenda';
import { AttendanceSection } from '../components/meeting/AttendanceSection';
import { MinutesSection } from '../components/meeting/MinutesSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function MeetingDetails() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState<MeetingFormApiData | null>(null);

  const {
    data: meeting,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => {
      if (!id) throw new Error('ID da reunião não fornecido');
      return meetingsApi.getById(id);
    },
    enabled: !!id,
  });

  console.log('Meeting', meeting);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Reunião não encontrada" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Reunião não encontrada" />
      </div>
    );
  }

  // Initialize editedMeeting if not set
  if (!editedMeeting) {
    setEditedMeeting(meeting);
    return null; // Return null to prevent rendering with uninitialized editedMeeting
  }

  const handleSave = async () => {
    if (!editedMeeting) return;
    
    try {
      await meetingsApi.update(meeting.id, editedMeeting);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleAttendanceChange = (attendeeIds: string[]) => {
    if (!editedMeeting) return;

    const presentAttendees = meeting.membrosParticipantes.filter(a => 
      attendeeIds.includes(a.id)
    );
    
    const attendanceList = presentAttendees
      .map(a => `- ${a.nome}`)
      .join('\n');

    const currentMinutes = editedMeeting.ata || '';
    const attendanceSection = '\n\nLista de Presença:\n' + attendanceList;

    setEditedMeeting({
      ...editedMeeting,
      ata: currentMinutes.includes('Lista de Presença:')
          ? currentMinutes.replace(/Lista de Presença:[\s\S]*$/, 'Lista de Presença:\n' + attendanceList)
          : currentMinutes + attendanceSection,
    });
  };

  // const isTodayMeeting = isToday(parseISO(meeting.date));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <MeetingHeader
        meeting={editedMeeting}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditedMeeting(meeting);
        }}
        onChange={setEditedMeeting}
      />

      <MeetingAgenda
        agendas={editedMeeting.pautas}
        isEditing={isEditing}
        onChange={(pautas) => setEditedMeeting({ ...editedMeeting, pautas })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceSection
          attendees={meeting.membrosParticipantes}
          meetingDate={meeting.dataHora}
          onAttendanceChange={handleAttendanceChange}
        />

        <MinutesSection
          minutes={editedMeeting.ata || ''}
          meetingDate={meeting.dataHora}
          onChange={(content) =>
            setEditedMeeting({
              ...editedMeeting,
              ata: content,
            })
          }
        />
      </div>
    </div>
  );
}