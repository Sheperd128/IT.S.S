import { useState, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, LogOut, Menu, X, Settings, Calendar, CheckSquare, Edit, DollarSign, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 1. DEFINE MENU ITEMS WITH ACCESS RULES
  const allMenuItems = [
    { name: 'Command Center', path: '/admin', icon: <LayoutDashboard size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'] },
    { name: 'Progress Sheet', path: '/admin/tasks', icon: <CheckSquare size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'] },
    { name: 'Master Calendar', path: '/admin/calendar', icon: <Calendar size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'] },
    { name: 'Treasury & Claims', path: '/admin/treasury', icon: <DollarSign size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'], requiresLead: true },
    { name: 'Edit Subcommittee', path: '/admin/subcommittee-edit', icon: <Edit size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'], requiresLead: true },
    { name: 'Team Manager', path: '/admin/team', icon: <Users size={20} />, allowedTeams: ['Executive'], requiresPresOrVice: true },
    { name: 'Frontend Override', path: '/admin/settings', icon: <Settings size={20} />, allowedTeams: ['Executive'] },
    { name: 'Document Vault', path: '/admin/vault', icon: <FileText size={20} />, allowedTeams: ['Executive', 'Academics', 'Wellness', 'Events', 'Research'] },
  ];

  // 2. FILTER MENU BASED ON WHO IS LOGGED IN
  const visibleMenuItems = allMenuItems.filter(item => {
    if (!user) return false;
    
    // Strict Pres/VP check
    if (item.requiresPresOrVice) {
      return user.team === 'Executive' && (user.title === 'President' || user.title === 'Vice President');
    }

    const inAllowedTeam = item.allowedTeams.includes(user.team);
    if (item.requiresLead) {
      const isLead = user.title === 'Lead' || user.title === 'Deputy Lead' || user.team === 'Executive';
      return inAllowedTeam && isLead;
    }
    return inAllowedTeam;
  });

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans text-zinc-200">
      
      <div className="md:hidden absolute top-0 left-0 w-full bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-20">
        <span className="font-consolas font-bold text-xl text-white uppercase">ITSS Admin</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 z-10 pt-16 md:pt-0`}>
        
        <div className="p-6 text-center border-b border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-3 flex items-center justify-center font-consolas text-2xl border border-zinc-600 font-bold">
            {user?.name.charAt(0)}
          </div>
          <h2 className="font-bold text-white uppercase truncate">{user?.name}</h2>
          <p className="text-xs font-consolas text-zinc-400 mt-1">{user?.team} | {user?.title}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-stencil uppercase text-sm ${
                location.pathname === item.path ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link to="/" className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 text-white font-bold text-sm uppercase hover:bg-zinc-700 transition-colors">
            <Globe size={16}/> View Website
          </Link>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2 bg-red-900/20 text-red-400 font-bold text-sm uppercase border border-red-900/50 hover:bg-red-900/40 transition-colors">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-10 pt-20 md:pt-10">
        <Outlet /> 
      </main>

    </div>
  );
}