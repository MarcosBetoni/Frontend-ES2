import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Meeting, MeetingFormApiData } from '../../types/meeting';
import { EditableField } from '../ui/EditableField';

interface MeetingHeaderProps {
  meeting: MeetingFormApiData;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (meeting: MeetingFormApiData) => void;
}

export function MeetingHeader({
  meeting,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: MeetingHeaderProps) {
  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(meeting.dataHora);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    onChange({ ...meeting, dataHora: newDate.toISOString() });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <EditableField
            value={meeting.titulo}
            isEditing={isEditing}
            onChange={(value) => onChange({ ...meeting, titulo: value })}
            className="text-2xl font-bold"
          />
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Salvar
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="Horário"
          value={format(new Date(meeting.dataHora), 'HH:mm', { locale: ptBR })}
          type="time"
          isEditing={isEditing}
          onChange={handleTimeChange}
        />
        <EditableField
          label="Local"
          value={meeting.local}
          isEditing={isEditing}
          onChange={(value) => onChange({ ...meeting, local: value })}
        />
      </div>
    </div>
  );
}