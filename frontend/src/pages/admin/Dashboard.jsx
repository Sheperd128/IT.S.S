import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { AlertCircle, CheckCircle, BellRing, BellOff, Calendar, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [budget, setBudget] = useState(0); // NEW: State for global budget
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isSuperAdmin = user?.title === 'President' || user?.title === 'Vice President';

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Fetch Tasks, Events, and the new Budget securely
      const [taskRes, eventRes, budgetRes] = await Promise.all([
        axios.get('https://itss-backend-upy6.onrender.com/api/operations/tasks', config),
        axios.get('https://itss-backend-upy6.onrender.com/api/operations/events', config),
        axios.get('https://itss-backend-upy6.onrender.com/api/treasury/budget', config)
      ]);
      
      setTasks(taskRes.data);
      setEvents(eventRes.data);
      setBudget(budgetRes.data.availableBalance);
    } catch (error) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (task) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://itss-backend-upy6.onrender.com/api/operations/tasks/${task._id}`, { needsExecHelp: !task.needsExecHelp }, config);
      fetchDashboardData();
    } catch (error) { alert('Failed to update flag status'); }
  };

  const toggleComplete = async (task) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      await axios.put(`https://itss-backend-upy6.onrender.com/api/operations/tasks/${task._id}`, { status: newStatus }, config);
      fetchDashboardData();
    } catch (error) { alert('Failed to update task'); }
  };

  const myTeamTasks = tasks.filter(t => t.assignedSubcommittee === user.team);
  const flaggedTasks = tasks.filter(t => t.needsExecHelp);
  
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="text-itss-white font-consolas">
      
      {/* HEADER */}
      <div className="mb-8 border-l-4 border-itss-primary pl-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-stencil uppercase text-itss-white tracking-widest">Dashboard</h1>
          <p className="text-zinc-400 text-sm">Operational Overview for {user?.title} ({user?.team})</p>
        </div>
        
        {isSuperAdmin && (
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${notificationsEnabled ? 'border-itss-success text-itss-success bg-itss-success/10' : 'border-zinc-700 text-zinc-500 bg-itss-black'}`}>
            {notificationsEnabled ? <><BellRing size={14}/> Alerts: ON</> : <><BellOff size={14}/> Alerts: OFF</>}
          </button>
        )}
      </div>

      {/* GLOBAL METRICS ROW (4 Columns now to fit the budget) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-itss-dark border border-itss-gray p-6 shadow-neon">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">Available Funds</p>
          <p className={`text-3xl font-bold mb-2 ${budget < 0 ? 'text-itss-danger' : 'text-itss-primary'}`}>
            R {budget.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-zinc-500">Total Society Ledger</p>
        </div>

        <div className="bg-itss-dark border border-itss-gray p-6">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">{user.team} Tasks</p>
          <p className="text-3xl font-bold text-white mb-2">{myTeamTasks.length} <span className="text-lg text-zinc-500 font-mono">Active</span></p>
          <p className="text-xs font-mono text-zinc-500">Current progress sheet</p>
        </div>
        
        <div className="bg-itss-dark border border-itss-gray p-6">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase">Exec Flags</p>
          <p className="text-3xl font-bold text-itss-danger mb-2">{flaggedTasks.length} <span className="text-lg text-zinc-500 font-mono">Alerts</span></p>
          <p className="text-xs font-mono text-zinc-500">Requires intervention</p>
        </div>

        <div className="bg-itss-dark border border-itss-gray p-6 flex flex-col justify-center">
          <p className="font-stencil text-zinc-500 text-xs mb-1 uppercase flex items-center gap-1"><Calendar size={14}/> Next Event</p>
          {nextEvent ? (
            <>
              <p className="text-xl font-bold text-white truncate" title={nextEvent.title}>{nextEvent.title}</p>
              <p className="text-xs font-mono text-itss-primary mt-1">{new Date(nextEvent.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
            </>
          ) : (
            <p className="text-sm font-mono text-zinc-500 mt-2">No events scheduled.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TEAM TASKS */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-stencil uppercase text-white border-b border-itss-gray pb-2">Your Team's Operations</h2>
          
          {loading ? <p className="text-zinc-500">Loading operations...</p> : myTeamTasks.length === 0 ? (
            <div className="bg-itss-dark p-8 text-center border border-itss-gray">
              <p className="text-zinc-500">No active tasks assigned to {user.team}. Check the Progress Sheet to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTeamTasks.map(task => (
                <div key={task._id} className={`p-5 bg-itss-dark border-l-4 ${task.needsExecHelp ? 'border-itss-danger' : task.status === 'Completed' ? 'border-itss-success opacity-70' : 'border-zinc-500'} flex flex-col md:flex-row justify-between md:items-center gap-4`}>
                  <div>
                    <h4 className={`font-bold text-lg ${task.status === 'Completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>{task.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase px-2 py-1 ${task.status === 'Completed' ? 'bg-itss-success/20 text-itss-success' : 'bg-itss-black border border-itss-gray text-zinc-300'}`}>
                      {task.status}
                    </span>
                    <button onClick={() => toggleFlag(task)} className={`flex items-center gap-1 text-xs uppercase font-bold px-3 py-2 border transition-colors ${task.needsExecHelp ? 'border-itss-danger text-itss-danger bg-itss-danger/10' : 'border-itss-gray text-zinc-500 hover:text-white'}`}>
                      <AlertCircle size={14} /> {task.needsExecHelp ? 'VP Flagged' : 'Flag VP'}
                    </button>
                    <button onClick={() => toggleComplete(task)} className="text-zinc-500 hover:text-itss-success transition-colors">
                      <CheckCircle size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: NOTIFICATION FEED (VP ONLY) */}
        {isSuperAdmin && (
          <div className="space-y-6">
            <h2 className="text-2xl font-stencil uppercase text-itss-danger border-b border-itss-danger/50 pb-2 flex items-center gap-2">
              <BellRing size={20} /> Action Required
            </h2>
            <div className="bg-itss-dark border border-itss-gray p-4 h-[500px] overflow-y-auto">
              {flaggedTasks.length === 0 ? (
                <p className="text-zinc-500 text-center mt-10">System nominal. No flagged operations.</p>
              ) : (
                <div className="space-y-4">
                  {flaggedTasks.map(alert => (
                    <div key={alert._id} className="bg-itss-danger/10 border border-itss-danger/30 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-itss-danger text-itss-white text-[10px] font-bold uppercase px-2 py-1">{alert.assignedSubcommittee}</span>
                        <span className="text-[10px] text-zinc-500">{new Date(alert.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-bold text-red-200 mb-3">{alert.title}</p>
                      <button onClick={() => toggleFlag(alert)} className="w-full bg-itss-black border border-itss-gray text-xs text-zinc-400 py-2 hover:text-white uppercase font-bold transition-colors">
                        Mark Resolved
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;