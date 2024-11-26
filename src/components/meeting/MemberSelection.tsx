import { useState } from 'react';
import { type Member } from '../../types/meeting';

interface MemberSelectionProps {
  members: Omit<Member, 'tipoUsuario'>[];
  selectedMembers: string[];
  onChange: (selectedMembers: string[]) => void;
  error?: string;
}

export function MemberSelection({
  members,
  selectedMembers,
  onChange,
  error,
}: MemberSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(
    (member) =>
      member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleMember = (memberId: string) => {
    // Verificar se o membro já está selecionado
    const isSelected = selectedMembers.includes(memberId);

    // Atualizar lista de membros selecionados
    if (isSelected) {
      onChange(selectedMembers.filter((id) => id !== memberId));
    } else {
      onChange([...selectedMembers, memberId]);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Selecionar Membros</h2>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <label
              key={member.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)}
                onChange={() => handleToggleMember(member.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{member.nome}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </section>
  );
}