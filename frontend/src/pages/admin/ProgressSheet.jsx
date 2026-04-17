import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function ProgressSheet() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  
  // Split the date and time for native browser popups
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    assignedSubcommittee: user?.team === 'Executive' ? 'Academics' : user?.team, 
    status: 'Pending', 
    needsExecHelp: false 
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/operations/tasks', config);
      setTasks(data);
    } catch (error) { console.error('Failed to fetch tasks'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDate || !formTime) return alert("Please select both a due date and a time.");

    try {
      // Combine date and time for MongoDB
      const combinedDate = new Date(`${formDate}T${formTime}`).toISOString();
      const payload = { ...formData, dueDate: combinedDate };

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/operations/tasks', payload, config);
      
      // Reset form but keep the user's team selected
      setFormData({ 
        title: '', 
        assignedSubcommittee: user?.team === 'Executive' ? 'Academics' : user?.team, 
        status: 'Pending', 
        needsExecHelp: false 
      });
      setFormDate('');
      setFormTime('');
      fetchTasks();
    } catch (error) { 
      alert(error.response?.data?.message || 'Database rejected task creation. Check fields.'); 
    }
  };

  const updateStatus = async (id, status, needsExecHelp) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/operations/tasks/${id}`, { status, needsExecHelp }, config);
      fetchTasks();
    } catch (error) { alert('Update failed'); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/operations/tasks/${id}`, config);
      fetchTasks();
    } catch (error) { alert('Delete failed'); }
  };

  return (
    <div className="text-itss-white font-consolas">
      <div className="mb-8 border-l-4 border-itss-primary pl-4">
        <h1 className="text-4xl font-stencil font-bold uppercase text-itss-white tracking-widest">Progress Sheet</h1>
        <p className="text-zinc-400 text-sm">Master tracking for all subcommittee operations.</p>
      </div>

      <div className="bg-itss-dark border border-itss-gray p-6 mb-8 shadow-neon">
        <h3 className="text-xl font-stencil uppercase text-itss-white mb-6 text-itss-primary">Initialize New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Task Directive</label>
              <input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Assigned Team</label>
              <select value={formData.assignedSubcommittee} onChange={e=>setFormData({...formData, assignedSubcommittee:e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none">
                <option value="Executive">Executive</option>
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Wellness">Wellness</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Deadline Date</label>
              <input type="date" required value={formDate} onChange={e=>setFormDate(e.target.value)} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none cursor-pointer font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1">Deadline Time</label>
              <input type="time" required value={formTime} onChange={e=>setFormTime(e.target.value)} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-primary focus:outline-none cursor-pointer font-mono text-sm" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer border border-itss-danger p-3 bg-itss-danger/10 hover:bg-itss-danger/20 transition-colors h-[46px] w-full justify-center">
              <input type="checkbox" checked={formData.needsExecHelp} onChange={e=>setFormData({...formData, needsExecHelp:e.target.checked})} className="accent-itss-danger w-4 h-4" />
              <span className="text-xs font-bold text-itss-danger uppercase tracking-widest">Flag Exec Help</span>
            </label>
          </div>

          <button type="submit" className="bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-6 h-[46px] w-full hover:bg-white transition-colors mt-2">
            Deploy Task
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className={`p-4 bg-itss-dark border-l-4 ${task.needsExecHelp ? 'border-itss-danger bg-itss-danger/10' : task.status === 'Completed' ? 'border-itss-success opacity-70' : 'border-itss-gray'} flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-lg`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {task.needsExecHelp && <AlertCircle size={16} className="text-itss-danger animate-pulse" />}
                <h4 className="font-bold text-lg text-white">{task.title}</h4>
              </div>
              <p className="text-xs text-zinc-400 m-0">Team: <span className="text-itss-primary">{task.assignedSubcommittee}</span> | Due: {new Date(task.dueDate).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task._id, e.target.value, task.needsExecHelp)}
                className={`p-2 text-xs font-bold uppercase focus:outline-none ${task.status === 'Completed' ? 'bg-itss-success/20 text-itss-success' : 'bg-itss-black text-zinc-300 border border-itss-gray'}`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button onClick={() => updateStatus(task._id, task.status, !task.needsExecHelp)} className={`text-xs uppercase font-bold px-3 py-2 border transition-colors ${task.needsExecHelp ? 'border-itss-danger text-itss-danger bg-itss-danger/20' : 'border-itss-gray text-zinc-500 hover:text-white hover:border-white'}`}>
                {task.needsExecHelp ? 'Resolve Flag' : 'Flag Exec'}
              </button>
              <button onClick={() => deleteTask(task._id)} className="text-zinc-600 hover:text-itss-danger px-2 font-bold transition-colors">X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}