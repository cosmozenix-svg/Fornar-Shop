import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, LayoutDashboard, Package, Users, ShoppingBag } from 'lucide-react';

export default function AdminLayout() {
  const { adminToken, adminLogout } = useAuthStore();
  const navigate = useNavigate();

  if (!adminToken) {
    return <Navigate to="/admin/fornar-portal" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/fornar-portal');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800 flex items-center justify-center">
          <span className="text-xl font-bold tracking-wider text-red-500">FORNAR ADMIN</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <LayoutDashboard size={20} className="mr-3" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <Package size={20} className="mr-3" /> Products
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <Package size={20} className="mr-3" /> Categories
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <ShoppingBag size={20} className="mr-3" /> Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition">
                <Users size={20} className="mr-3" /> Users
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition">
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Admin Mode</span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
