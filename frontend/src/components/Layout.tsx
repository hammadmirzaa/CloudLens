import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Server, Container, Database, FileText, 
  CreditCard, GitBranch, CloudCog, Sun, Moon, Search, Menu, ChevronLeft, LogOut
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Simulate global search navigation based on keyword matching
    const query = searchQuery.toLowerCase();
    setSearchQuery('');
    
    if (['compute', 'vm', 'instance'].some(k => query.includes(k))) {
      navigate('/compute');
      addToast(`Navigated to Compute Engine based on search`, 'success');
    } else if (['run', 'serverless'].some(k => query.includes(k))) {
      navigate('/cloud-run');
      addToast(`Navigated to Cloud Run based on search`, 'success');
    } else if (['gke', 'kubernetes', 'cluster'].some(k => query.includes(k))) {
      navigate('/gke');
      addToast(`Navigated to GKE based on search`, 'success');
    } else if (['sql', 'database', 'db'].some(k => query.includes(k))) {
      navigate('/cloud-sql');
      addToast(`Navigated to Cloud SQL based on search`, 'success');
    } else if (['log', 'error'].some(k => query.includes(k))) {
      navigate('/logs');
      addToast(`Navigated to Logs based on search`, 'success');
    } else if (['bill', 'cost', 'spend'].some(k => query.includes(k))) {
      navigate('/billing');
      addToast(`Navigated to Billing based on search`, 'success');
    } else if (['ci', 'cd', 'build', 'pipeline'].some(k => query.includes(k))) {
      navigate('/cicd');
      addToast(`Navigated to CI/CD based on search`, 'success');
    } else {
      addToast(`No specific resource matched "${query}". Global search is currently mocked.`, 'info');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-900 overflow-hidden text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-950 flex flex-col hidden md:flex border-r border-gray-200 dark:border-slate-800 transition-all duration-300 z-20`}>
        <div className={`p-5 border-b border-gray-200 dark:border-slate-800 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20">
              C
            </div>
            {!sidebarCollapsed && <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">CloudLens</h1>}
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={sidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-center">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 sticky top-0 transition-colors duration-200">
          <div className="flex items-center md:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              C
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl pr-8">
            <form onSubmit={handleGlobalSearch} className="w-full relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources, metrics, logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 text-slate-900 dark:text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:bg-white focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm focus:shadow-md"
              />
              {/* Keyboard shortcut hint */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
                <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 border border-gray-300 dark:border-slate-700 rounded px-1.5 py-0.5">/</span>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent dark:hover:border-slate-700 group relative">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-slate-300 font-semibold text-sm border border-transparent dark:border-slate-700">
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user?.name || 'User'}</span>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 hidden group-hover:block z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
