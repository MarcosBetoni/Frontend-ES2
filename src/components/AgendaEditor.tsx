import { Agenda } from '../types/meeting';

interface AgendaEditorProps {
  agendas: Agenda[];
  isEditing: boolean;
  onChange: (agendas: Agenda[]) => void;
}

export function AgendaEditor({ agendas, isEditing, onChange }: AgendaEditorProps) {
  const handleAddAgenda = () => {
    const newAgenda: Agenda = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      order: agendas.length + 1,
    };
    onChange([...agendas, newAgenda]);
  };

  const handleUpdateAgenda = (id: string, updates: Partial<Agenda>) => {
    onChange(
      agendas.map(agenda =>
        agenda.id === id ? { ...agenda, ...updates } : agenda
      )
    );
  };

  const handleRemoveAgenda = (id: string) => {
    onChange(
      agendas
        .filter(agenda => agenda.id !== id)
        .map((agenda, index) => ({ ...agenda, order: index + 1 }))
    );
  };

  return (
    <div className="space-y-4">
      {agendas.map(agenda => (
        <div
          key={agenda.id}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
        >
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={agenda.title}
                onChange={e => handleUpdateAgenda(agenda.id, { title: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Título da pauta"
              />
              <textarea
                value={agenda.description}
                onChange={e => handleUpdateAgenda(agenda.id, { description: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                placeholder="Descrição da pauta"
                rows={2}
              />
              <button
                onClick={() => handleRemoveAgenda(agenda.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remover
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <h4 className="font-medium">
                {agenda.order}. {agenda.title}
              </h4>
              <p className="text-gray-600 mt-1">{agenda.description}</p>
            </div>
          )}
        </div>
      ))}
      
      {isEditing && (
        <button
          onClick={handleAddAgenda}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Adicionar Pauta
        </button>
      )}
    </div>
  );
}