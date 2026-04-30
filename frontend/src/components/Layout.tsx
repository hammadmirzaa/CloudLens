import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Container, 
  Database, 
  FileText, 
  CreditCard, 
  GitBranch,
  CloudCog
} from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Compute', path: '/compute', icon: <Server size={20} /> },
    { name: 'Cloud Run', path: '/cloud-run', icon: <CloudCog size={20} /> },
    { name: 'GKE', path: '/gke', icon: <Container size={20} /> },
    { name: 'Cloud SQL', path: '/cloud-sql', icon: <Database size={20} /> },
    { name: 'Logs', path: '/logs', icon: <FileText size={20} /> },
    { name: 'Billing', path: '/billing', icon: <CreditCard size={20} /> },
    { name: 'CI/CD', path: '/cicd', icon: <GitBranch size={20} /> },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold text-xl">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight">CloudLens</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          CloudLens v1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-lg text-slate-800">CloudLens</span>
          </div>
          
          <div className="hidden md:flex flex-1">
            {/* Optional Topbar Search/Breadcrumbs */}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
