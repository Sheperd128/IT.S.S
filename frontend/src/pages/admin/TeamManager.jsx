import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { UserPlus, Trash2 } from 'lucide-react';

const TeamManager = () => {
  const { user, register } = useContext(AuthContext); // Re-using register function for ease
  const [team, setTeam] = useState([]);
  
  // Create User Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
    team: 'Academics', title: 'Lead', isApproved: true // Direct adds are auto-approved
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('http://localhost:5000/api/users', config);
      setTeam(response.data.filter(u => u.team !== 'General'));
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
    
    // Call the public register route, but we will bypass login since we are just adding them
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Personnel Added Successfully!');
      setFormData({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '', team: 'Academics', title: 'Lead', isApproved: true });
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating personnel');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm termination of personnel?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
        fetchTeam();
      } catch (error) {
        alert('Failed to terminate');
      }
    }
  };

  return (
    <div className="text-zinc-200">
      <div className="mb-8 border-l-4 border-white pl-4">
        <h1 className="text-4xl font-consolas font-bold uppercase text-white tracking-widest">Team Management</h1>
        <p className="font-mono text-zinc-400 text-sm">Assign roles and manage active personnel.</p>
      </div>

      {/* CREATE USER FORM */}
      <div className="bg-zinc-900 border border-zinc-700 p-6 mb-12 shadow-magazine-dark">
        <h3 className="text-xl font-consolas uppercase text-white mb-6 flex items-center gap-2"><UserPlus size={20}/> Onboard Personnel</h3>
        
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Full Name</label>
              <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Email Address</label>
              <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Phone Number</label>
              <input type="text" required value={formData.phoneNumber} onChange={e=>setFormData({...formData, phoneNumber:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Team Assignment</label>
              <select value={formData.team} onChange={e=>setFormData({...formData, team:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white">
                <option value="Executive">Executive</option>
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Wellness">Wellness</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Title / Rank</label>
              <select value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white">
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Secretary">Secretary</option>
                <option value="Lead">Subcommittee Lead</option>
                <option value="Deputy Lead">Deputy Lead</option>
                <option value="Member">Committee Member</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Initial Password</label>
              <input type="password" required value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-1 uppercase tracking-widest">Confirm Password</label>
              <input type="password" required value={formData.confirmPassword} onChange={e=>setFormData({...formData, confirmPassword:e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 p-3 text-white focus:outline-none focus:border-white" />
            </div>
          </div>

          <button type="submit" className="bg-white text-black font-bold uppercase tracking-widest px-8 py-3 w-full hover:bg-zinc-300 transition-colors mt-4">
            Initialize Personnel Record
          </button>
        </form>
      </div>

      {/* ACTIVE PERSONNEL LIST */}
      <h3 className="text-xl font-consolas uppercase text-white mb-6">Active Leadership Roster</h3>
      <div className="grid gap-4">
        {team.map(member => (
          <div key={member._id} className={`flex items-center justify-between p-4 bg-zinc-900 border-l-4 ${member.team === 'Executive' ? 'border-yellow-500' : 'border-zinc-500'}`}>
            <div className="flex items-center gap-4">
              <img src={member.profilePic} alt="pfp" className="w-12 h-12 object-cover border border-zinc-700 grayscale" />
              <div>
                <h4 className="font-bold uppercase text-white tracking-wider m-0 leading-tight">{member.name}</h4>
                <p className="font-mono text-xs text-zinc-400 m-0">{member.email}</p>
                <div className="mt-1 flex gap-2 font-stencil text-[10px] uppercase">
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-1">{member.team}</span>
                  <span className="bg-zinc-950 border border-zinc-700 text-zinc-400 px-2 py-1">{member.title}</span>
                </div>
              </div>
            </div>
            {member._id !== user._id && (
              <button onClick={() => handleDelete(member._id)} className="text-red-500 hover:text-red-400 p-2 border border-transparent hover:border-red-900/50 bg-red-900/10 transition-all">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;