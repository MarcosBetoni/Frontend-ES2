import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const menuItems = [
  { path: '/', label: 'Início', icon: '🏠' },
  { path: '/membros', label: 'Lista de Membros', icon: '👥' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Sistema de Reuniões</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
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
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}