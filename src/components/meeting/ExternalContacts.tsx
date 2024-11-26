import { useState } from 'react';

interface ExternalContact {
  name: string;
  email: string;
}

interface ExternalContactsProps {
  contacts: ExternalContact[];
  onChange: (contacts: ExternalContact[]) => void;
}

export function ExternalContacts({ contacts, onChange }: ExternalContactsProps) {
  const [newContact, setNewContact] = useState<ExternalContact>({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<ExternalContact>>({});

  const validateContact = () => {
    const newErrors: Partial<ExternalContact> = {};

    if (!newContact.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!newContact.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    if (!validateContact()) {
      return;
    }

    onChange([...contacts, newContact]);
    setNewContact({ name: '', email: '' });
    setErrors({});
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    onChange(updatedContacts);
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Contatos Externos</h2>

      {/* Existing Contacts */}
      {contacts.length > 0 && (
        <div className="mb-6 space-y-4">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-600">{contact.email}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Contact */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleAddContact}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Adicionar Contato Externo
          </button>
        </div>
      </div>
    </section>
  );
}