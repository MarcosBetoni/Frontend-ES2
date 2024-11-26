export interface Member {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: 'GERENTE' | 'MEMBRO';
}