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
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">CloudLens</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>CloudLens v1.0.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-lg text-white">CloudLens</span>
          </div>
          
          <div className="hidden md:flex flex-1">
            {/* Optional Topbar Search/Breadcrumbs */}
            <div className="text-sm font-medium text-slate-400">
              GCP Infrastructure Monitoring
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-sm border border-slate-700">
                A
              </div>
              <span className="text-sm font-medium text-slate-300 hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
