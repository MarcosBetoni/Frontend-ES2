import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { meetingsApi, membersApi } from '../services/api';
import { AgendaForm } from '../components/meeting/AgendaForm';
import { MemberSelection } from '../components/meeting/MemberSelection';
import { ExternalContacts } from '../components/meeting/ExternalContacts';
import { type Agenda, type MeetingFormApiData } from '../types/meeting';

interface ExternalContact {
  name: string;
  email: string;
}

interface MeetingFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  agendas: Agenda[];
  selectedMembers: string[];
  externalContacts: ExternalContact[];
}

export function CreateMeeting() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    agendas: [],
    selectedMembers: [],
    externalContacts: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MeetingFormData, string>>>({});

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: membersApi.getAll,
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof MeetingFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }
    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Local/Link é obrigatório';
    }
    if (formData.agendas.length === 0) {
      newErrors.agendas = 'Adicione pelo menos uma pauta';
    }
    if (formData.selectedMembers.length === 0 && formData.externalContacts.length === 0) {
      newErrors.selectedMembers = 'Selecione pelo menos um participante';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // transform in MeetingFormApiData

      const meeting: Omit<MeetingFormApiData, 'id'> = {
        titulo: formData.title,
        dataHora: `${formData.date}T${formData.time}`,
        local: formData.location,
        ata: '',
        pautas: formData.agendas.map(({ title, description }) => ({ titulo: title, descricao: description })),
        membrosParticipantes: handleMembers(),
      };

      // Create meeting
      await meetingsApi.create(meeting);

      // Simulate success and redirect
      navigate('/');
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const handleMembers = (): { nome: string; email: string; }[] => {
    const selectedMembers = formData.selectedMembers.map((id) => {
      const member = members.find((m) => m.id === id);
      if (member) {
        return { email: member.email, nome: member.nome };
      }
    }).filter(Boolean) as { nome: string; email: string; }[]; // Filter out undefined values

    const externalContacts = formData.externalContacts.map((contact) => {
      return { email: contact.email, nome: contact.name };
    });

    return [...selectedMembers, ...externalContacts];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nova Reunião</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Meeting Details Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Detalhes da Reunião</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Local/Link
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
          </div>
        </section>

        {/* Agenda Section */}
        <AgendaForm
          agendas={formData.agendas}
          onChange={(agendas) => setFormData({ ...formData, agendas })}
          error={errors.agendas}
        />

        {/* Member Selection Section */}
        <MemberSelection
          members={members}
          selectedMembers={formData.selectedMembers}
          onChange={(selectedMembers) => setFormData({ ...formData, selectedMembers })}
          error={errors.selectedMembers}
        />

        {/* External Contacts Section */}
        <ExternalContacts
          contacts={formData.externalContacts}
          onChange={(externalContacts) => setFormData({ ...formData, externalContacts })}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Criar Convite
          </button>
        </div>
      </form>
    </div>
  );
}