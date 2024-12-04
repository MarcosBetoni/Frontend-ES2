import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const menuItems = [
  { path: '/', label: 'Início', icon: '🏠' },
  { path: '/membros', label: 'Lista de Membros', icon: '👥' },
  { path: '/login', label: 'Sair', icon: '🚪', isLogout: true }
];

export function Sidebar() {
  const location = useLocation();


  const userData = localStorage.getItem('user');
  let email = '';

  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      email = parsedUserData.user.email;
      localStorage.setItem('tipoUsuario', parsedUserData.user.tipoUsuario);
    } catch (error) {
      console.error('Erro ao analisar os dados do usuário:', error);
    }
  }

  const handleLogout = () => {
    // Limpar dados do usuário do local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirecionar para a página de login
    window.location.href = '/login';
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Sistema de Reuniões</h1>
        <div className="mb-6 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">Bem-vindo,</p>
          <p className="text-sm font-medium truncate">{email}</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.isLogout ? (
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-lg transition-colors w-full text-left',
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-lg transition-colors',
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}