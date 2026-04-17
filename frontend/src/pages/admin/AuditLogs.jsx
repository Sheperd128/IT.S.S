import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Activity, Clock } from 'lucide-react';

export default function AuditLogs() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Assuming you made a quick router.get('/api/audit') for this! 
        // For now, we will fetch directly from operations if you attach it there, 
        // but creating a dedicated audit route in backend/server.js is best.
        const { data } = await axios.get('http://localhost:5000/api/audit', config);
        setLogs(data);
      } catch (error) { console.error('Failed to fetch logs'); }
    };
    fetchLogs();
  }, [user]);

  if (user?.title !== 'President' && user?.title !== 'Vice President') {
    return <div className="text-itss-danger font-stencil p-8 text-2xl">ACCESS DENIED.</div>;
  }

  return (
    <div className="text-itss-white font-consolas pb-20">
      <div className="mb-8 border-l-4 border-itss-warning pl-4">
        <h1 className="text-4xl font-stencil uppercase tracking-widest text-itss-white">System Audit Log</h1>
        <p className="text-zinc-400 text-sm">Immutable tracking of all platform modifications.</p>
      </div>

      <div className="bg-itss-dark border border-itss-gray p-6 shadow-neon">
        <h2 className="text-xl font-stencil uppercase text-itss-warning mb-6 flex items-center gap-2 border-b border-itss-gray pb-2">
          <Activity size={20} /> Action Ledger
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-itss-black text-zinc-400 font-stencil uppercase tracking-widest text-xs border-b border-itss-gray">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Personnel</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Payload</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 text-xs text-zinc-500 font-mono flex items-center gap-2">
                    <Clock size={12}/> {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-itss-primary">
                    {log.user} <span className="text-[10px] text-zinc-500 block uppercase">{log.team}</span>
                  </td>
                  <td className="p-4 text-itss-success">{log.action}</td>
                  <td className="p-4 text-zinc-300 italic">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <p className="text-center p-8 text-zinc-500">No logs recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}