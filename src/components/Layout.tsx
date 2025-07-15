import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  School,
  Bell,
  User,
  Calendar,
  Building,
  GraduationCap,
  Calculator
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(user?.role === 'admin' ? [
      { path: '/academic-years', label: 'Tahun Akademik', icon: Calendar },
      { path: '/institutions', label: 'Institusi', icon: Building },
    ] : []),
    { path: '/classes', label: 'Manajemen Kelas', icon: GraduationCap },
    { path: '/billing', label: 'Billing & Tagihan', icon: Calculator },
    { path: '/students', label: 'Manajemen Siswa', icon: Users },
    { path: '/payments', label: 'Pembayaran', icon: CreditCard },
    { path: '/reports', label: 'Laporan', icon: FileText },
    ...(user?.role === 'admin' ? [{ path: '/settings', label: 'Pengaturan', icon: Settings }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = () => {
    return new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <School className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-lg font-semibold text-gray-800">SPP System</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">{formatDateTime()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.institution}</p>
                <p className="text-xs text-gray-500">Tahun Akademik 2024/2025</p>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;