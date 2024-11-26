import { Agenda } from '../../types/meeting';

interface MeetingAgendaProps {
  agendas: Agenda[];
  isEditing: boolean;
  onChange: (agendas: Agenda[]) => void;
}

export function MeetingAgenda({ agendas, isEditing, onChange }: MeetingAgendaProps) {
  const handleAddAgenda = () => {
    const newAgenda: Agenda = {
      titulo: '',
      descricao: '',
    };
    onChange([...agendas, newAgenda]);
  };

  const handleUpdateAgenda = (id: string, updates: Partial<Agenda>) => {
    onChange(
      agendas.map((agenda) =>
        agenda.id === id ? { ...agenda, ...updates } : agenda
      )
    );
  };

  const handleRemoveAgenda = (id: string) => {
    onChange(
      agendas
        .filter((agenda) => agenda.id !== id)
        .map((agenda, index) => ({ ...agenda, order: index + 1 }))
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pautas</h2>
        {isEditing && (
          <button
            onClick={handleAddAgenda}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Adicionar Pauta
          </button>
        )}
      </div>

      <div className="space-y-4">
        {agendas.map((agenda) => (
          <div
            key={agenda.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={agenda.titulo}
                  // onChange={(e) =>
                  //   handleUpdateAgenda(agenda.id, { title: e.target.value })
                  // }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Título da pauta"
                />
                <textarea
                  value={agenda.descricao}
                  // onChange={(e) =>
                  //   handleUpdateAgenda(agenda.id, { description: e.target.value })
                  // }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Descrição da pauta"
                  rows={2}
                />
                <button
                  // onClick={() => handleRemoveAgenda(agenda.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-medium">
                  {agenda.titulo}
                </h3>
                <p className="text-gray-600 mt-1">{agenda.descricao}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}