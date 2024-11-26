import { useState } from 'react';
import { type Agenda } from '../../types/meeting';

interface AgendaFormProps {
  agendas: Agenda[];
  onChange: (agendas: Agenda[]) => void;
  error?: string;
}

export function AgendaForm({ agendas, onChange, error }: AgendaFormProps) {
  const [newAgenda, setNewAgenda] = useState({
    title: '',
    description: '',
  });

  const handleAddAgenda = () => {
    if (!newAgenda.title.trim() || !newAgenda.description.trim()) {
      return;
    }

    const agenda: Agenda = {
      id: crypto.randomUUID(),
      title: newAgenda.title,
      description: newAgenda.description,
      order: agendas.length + 1,
    };

    onChange([...agendas, agenda]);
    setNewAgenda({ title: '', description: '' });
  };

  const handleRemoveAgenda = (id: string) => {
    const updatedAgendas = agendas
      .filter((agenda) => agenda.id !== id)
      .map((agenda, index) => ({
        ...agenda,
        order: index + 1,
      }));
    onChange(updatedAgendas);
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Pautas</h2>

      {/* Existing Agendas */}
      {agendas.length > 0 && (
        <div className="mb-6 space-y-4">
          {agendas.map((agenda) => (
            <div
              key={agenda.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {agenda.order}. {agenda.title}
                </h3>
                <p className="mt-1 text-gray-600">{agenda.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAgenda(agenda.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Agenda */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título da Pauta
          </label>
          <input
            type="text"
            value={newAgenda.title}
            onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            value={newAgenda.description}
            onChange={(e) => setNewAgenda({ ...newAgenda, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleAddAgenda}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Adicionar Pauta
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}