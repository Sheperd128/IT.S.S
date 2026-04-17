import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Download, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Research() {
  const [data, setData] = useState(null);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, teamRes] = await Promise.all([
          axios.get('http://localhost:5000/api/operations/subcommittee/Research'),
          axios.get('http://localhost:5000/api/users/public-team')
        ]);
        setData(subRes.data);
        setTeam(teamRes.data.filter(member => member.team === 'Research'));
      } catch (error) { console.error("Fetch failed", error); }
    };
    fetchData();
  }, []);

  if (!data) return <div className="min-h-screen bg-itss-black text-itss-orange flex justify-center items-center font-stencil text-2xl animate-pulse">Loading Research Data...</div>;

  return (
    <div className="min-h-screen bg-itss-black text-itss-white py-16 px-4 font-consolas">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-zinc-400 hover:text-white font-stencil text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">← Return to Home</Link>
        
        <div className="mb-16 border-l-4 border-itss-orange pl-6">
          <h1 className="text-5xl md:text-7xl font-stencil text-white uppercase tracking-wider">{data.name} & Support</h1>
          <p className="font-consolas tracking-widest text-itss-orange mt-2">{data.tagline}</p>
        </div>

        <div className="bg-itss-dark border border-itss-gray p-8 shadow-neon mb-16">
          <h2 className="text-2xl font-stencil uppercase text-white mb-4 border-b border-itss-gray pb-2">Mission Directive</h2>
          <p className="font-consolas text-zinc-300 leading-relaxed">{data.mission}</p>
        </div>

        {/* CUSTOM MODULE: DATA VAULT (Resources) */}
        <div className="mb-16">
          <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
            <Database className="text-itss-orange" size={32}/> The Data Vault
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.resources && data.resources.length > 0 ? (
              data.resources.map((res, i) => (
                <div key={i} className="bg-itss-dark border border-itss-gray p-6 flex justify-between items-center group hover:border-itss-orange transition-colors">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 uppercase tracking-widest">{res.title}</h3>
                    <p className="text-xs text-zinc-500 font-mono">Internal Template / Document</p>
                  </div>
                  <a href={res.url} target="_blank" rel="noreferrer" className="bg-itss-black border border-itss-gray p-4 text-itss-orange hover:bg-itss-orange hover:text-black transition-colors">
                    <Download size={24} />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 italic">No data currently hosted in the vault.</p>
            )}
          </div>
        </div>

        {/* MEET THE TEAM */}
        <div>
          <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
            <User className="text-itss-orange" size={32}/> Research Analysts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member._id} className="bg-itss-dark border border-itss-gray hover:border-itss-orange transition-colors flex flex-col">
                <img src={member.profilePic} alt={member.name} className="w-full aspect-square object-cover grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all" />
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-white">{member.name}</h3>
                  <p className="font-stencil text-xs text-itss-orange mb-2">{member.title}</p>
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