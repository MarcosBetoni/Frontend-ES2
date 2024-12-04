import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// import { isToday, parseISO } from 'date-fns';
import { meetingsApi } from '../services/api';
import { MeetingFormApiData, MembrosParticipantes } from '../types/meeting';
import { MeetingHeader } from '../components/meeting/MeetingHeader';
import { MeetingAgenda } from '../components/meeting/MeetingAgenda';
import { AttendanceSection } from '../components/meeting/AttendanceSection';
import { MinutesSection } from '../components/meeting/MinutesSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { SaveMinutesModal } from '../components/SaveMinutesModal';
import { parseISO } from 'date-fns';
import { ReportButton } from '../components/ui/ReportButton';

export function MeetingDetails() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState<MeetingFormApiData | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [presentAttendees, setPresentAttendees] = useState<MembrosParticipantes[]>([]);

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

    setPresentAttendees(presentAttendees);
    
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

  const handleAttendanceSave = async () => {
    if (!editedMeeting) return;

    // set estaPresente to true for all present attendees
    const updatedMembers = meeting.membrosParticipantes.map(member => ({
      ...member,
      estaPresente: presentAttendees.some(a => a.id === member.id),
    }));

    try {
      await meetingsApi.markAttendance(meeting.id, updatedMembers);
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
    }
    
  }

  const handleSaveMinutes = async (password: string) => {
    if (!editedMeeting) return;

    try {
      await meetingsApi.addMinutes(meeting.id, password, editedMeeting.ata || '');
      setIsSaveModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Erro ao salvar ATA:', error);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isTodayMeeting = isToday(parseISO(meeting.dataHora));

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

      <div className="grid grid-rows-1 gap-8">
        <div className="space-y-4">
          <AttendanceSection
            attendees={meeting.membrosParticipantes}
            meetingDate={meeting.dataHora}
            onAttendanceChange={handleAttendanceChange}
          />
          <div className="flex justify-end">
            <button
              onClick={handleAttendanceSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={!isTodayMeeting}
            >
              Marcar Presenças
            </button>
            </div>
        </div>

        <div className="space-y-4">
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
         <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={!isTodayMeeting}
            >
              Salvar Ata
            </button>
            <ReportButton meeting={meeting} />
          </div>
        </div>
      </div>
      <SaveMinutesModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveMinutes}
      />
    </div>
  );
}