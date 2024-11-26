import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meeting, Member } from '../types/meeting';
import { MinutesEditor } from './MinutesEditor';
import { AttendanceTracker } from './AttendanceTracker';
import { EditableField } from './EditableField';
import { AgendaEditor } from './AgendaEditor';

interface TodayMeetingItemProps {
  meeting: Meeting;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function TodayMeetingItem({ meeting, isEditing, onEditToggle }: TodayMeetingItemProps) {
  const [editedMeeting, setEditedMeeting] = useState(meeting);
  const [attendance, setAttendance] = useState<string[]>([]);

  const handleSave = async () => {
    try {
      // Em produção, chamar a API para salvar as alterações
      console.log('Saving meeting:', editedMeeting);
      onEditToggle();
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleAttendanceChange = (memberIds: string[]) => {
    setAttendance(memberIds);
    // Atualizar a ata com a lista de presença
    const attendanceText = `\n\nLista de Presença:\n${memberIds.map(id => {
      const member = meeting.attendees.find(m => m.id === id);
      return `- ${member?.name}`;
    }).join('\n')}`;
    
    setEditedMeeting(prev => ({
      ...prev,
      minutes: {
        ...prev.minutes!,
        content: `${prev.minutes?.content || ''}${attendanceText}`,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <EditableField
            value={editedMeeting.title}
            isEditing={isEditing}
            onChange={value => setEditedMeeting({ ...editedMeeting, title: value })}
            className="text-xl font-semibold"
          />
          <div className="mt-2 space-y-2 text-gray-600">
            <EditableField
              value={format(new Date(editedMeeting.date), "HH:mm", { locale: ptBR })}
              isEditing={isEditing}
              type="time"
              onChange={value => {
                const [hours, minutes] = value.split(':');
                const newDate = new Date(editedMeeting.date);
                newDate.setHours(parseInt(hours), parseInt(minutes));
                setEditedMeeting({ ...editedMeeting, date: newDate.toISOString() });
              }}
              label="Horário"
            />
            <EditableField
              value={editedMeeting.location}
              isEditing={isEditing}
              onChange={value => setEditedMeeting({ ...editedMeeting, location: value })}
              label="Local"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Salvar
              </button>
              <button
                onClick={onEditToggle}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={onEditToggle}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Pautas</h3>
        <AgendaEditor
          agendas={editedMeeting.agendas}
          isEditing={isEditing}
          onChange={agendas => setEditedMeeting({ ...editedMeeting, agendas })}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Lista de Presença</h3>
        <AttendanceTracker
          attendees={editedMeeting.attendees}
          selectedIds={attendance}
          onChange={handleAttendanceChange}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Ata da Reunião</h3>
        <MinutesEditor
          value={editedMeeting.minutes?.content || ''}
          onChange={content =>
            setEditedMeeting({
              ...editedMeeting,
              minutes: {
                ...(editedMeeting.minutes || { id: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
                content,
              },
            })
          }
        />
      </div>
    </div>
  );
}