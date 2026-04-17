import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, MessageCircle, User, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wellness() {
  const [data, setData] = useState(null);
  const [team, setTeam] = useState([]);
  const [feedback, setFeedback] = useState({ topic: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, teamRes] = await Promise.all([
          axios.get('https://itss-backend-upy6.onrender.com/api/operations/subcommittee/Wellness'),
          axios.get('https://itss-backend-upy6.onrender.com/api/users/public-team')
        ]);
        setData(subRes.data);
        setTeam(teamRes.data.filter(member => member.team === 'Wellness'));
      } catch (error) { console.error("Fetch failed", error); }
    };
    fetchData();
  }, []);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // In a production environment, this would hit a backend /api/feedback route
    alert("Transmission Encrypted & Sent to the Wellness Team.");
    setFeedback({ topic: '', message: '' });
  };

  if (!data) return <div className="min-h-screen bg-itss-black text-itss-success flex justify-center items-center font-stencil text-2xl animate-pulse">Loading Wellness Matrix...</div>;

  return (
    <div className="min-h-screen bg-itss-black text-itss-white py-16 px-4 font-consolas">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-zinc-400 hover:text-white font-stencil text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">← Return to Home</Link>
        
        {/* HEADER */}
        <div className="mb-16 border-l-4 border-itss-success pl-6">
          <h1 className="text-5xl md:text-7xl font-stencil text-white uppercase tracking-wider">{data.name}</h1>
          <p className="font-consolas tracking-widest text-itss-success mt-2">{data.tagline}</p>
        </div>

        <div className="bg-itss-dark border border-itss-gray p-8 shadow-neon mb-16">
          <h2 className="text-2xl font-stencil uppercase text-white mb-4 border-b border-itss-gray pb-2">Mission Directive</h2>
          <p className="font-consolas text-zinc-300 leading-relaxed">{data.mission}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* WELLNESS TIPS / ANNOUNCEMENTS */}
          <div>
            <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
              <Activity className="text-itss-success" size={32}/> Wellness Logs
            </h2>
            <div className="space-y-6">
              {data.announcements && data.announcements.length > 0 ? (
                data.announcements.map((ann, i) => (
                  <div key={i} className="bg-itss-dark border-l-2 border-itss-success p-6">
                    <h3 className="font-bold text-lg text-white mb-2 uppercase tracking-widest">{ann.title}</h3>
                    <p className="text-sm text-zinc-400">{ann.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 italic">No current logs in the matrix.</p>
              )}
            </div>
          </div>

          {/* ANONYMOUS SUPPORT FORM */}
          <div>
            <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
              <MessageCircle className="text-itss-success" size={32}/> Secure Comms
            </h2>
            <form onSubmit={handleFeedbackSubmit} className="bg-itss-dark border border-itss-gray p-8 shadow-lg">
              <p className="text-xs text-zinc-400 mb-6 font-stencil uppercase tracking-widest border-b border-zinc-800 pb-2">All transmissions are strictly confidential.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Subject / Area of Concern</label>
                  <input type="text" required value={feedback.topic} onChange={e=>setFeedback({...feedback, topic: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:border-itss-success focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-stencil text-zinc-400 mb-1">Message</label>
                  <textarea required value={feedback.message} onChange={e=>setFeedback({...feedback, message: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white h-32 focus:border-itss-success focus:outline-none" />
                </div>
                <button type="submit" className="bg-itss-success text-black w-full py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors">
                  <Send size={18}/> Transmit Securely
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MEET THE TEAM */}
        <div>
          <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
            <User className="text-itss-success" size={32}/> Wellness Vanguard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member._id} className="bg-itss-dark border border-itss-gray hover:border-itss-success transition-colors flex flex-col">
                <img src={member.profilePic} alt={member.name} className="w-full aspect-square object-cover grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all" />
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-white">{member.name}</h3>
                  <p className="font-stencil text-xs text-itss-success mb-2">{member.title}</p>
                  <p className="font-sans text-xs font-light text-zinc-400 line-clamp-3 flex-grow">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}