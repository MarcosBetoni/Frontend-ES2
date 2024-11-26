export interface Agenda {
  id?: string;
  titulo: string;
  descricao: string;
}

export interface Minutes {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'GERENTE' | 'MEMBRO';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  agendas: Agenda[];
  minutes?: Minutes;
  attendees: Member[];
}

export interface MeetingFormApiData {
  id: string;
  titulo: string;
  dataHora: string;
  local: string;
  ata?: string;
  pautas: Pauta[];
  membrosParticipantes: MembrosParticipantes[];
}

export interface Pauta{
  id: string;
  titulo: string;
  descricao: string;
}

export interface MembrosParticipantes{
  id: string;
  nome: string;
  email: string;
}