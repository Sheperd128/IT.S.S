import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MeetTheTeam() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('https://itss-backend-upy6.onrender.com/api/users/public-team');
        setLeaders(response.data);
      } catch (error) {
        console.error("Failed to fetch team", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const getTeamMembers = (teamName) => leaders.filter(user => user.team === teamName);

  if (loading) return <div className="text-center py-20 font-mono text-white">LOADING ASSETS...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-colossus text-white mb-4">THE SQUAD</h1>
          <p className="font-stencil tracking-widest text-zinc-400">ITSS FOUNDING MEMBERS & LEADERSHIP</p>
        </div>

        {/* EXECUTIVES */}
        <div className="mb-20">
          <h2 className="text-3xl font-colossus border-b-4 border-white pb-2 mb-8 inline-block text-white">Executive Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getTeamMembers('Executive').map(member => (
              <div key={member._id} className="bg-zinc-900 border-2 border-white shadow-magazine-dark overflow-hidden group">
                <img src={member.profilePic} alt={member.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="p-4 border-t-2 border-white">
                  <h3 className="font-bold text-xl uppercase tracking-wider text-white">{member.name}</h3>
                  <p className="font-stencil text-sm text-zinc-400 mb-3">{member.title}</p>
                  <p className="font-sans text-sm font-light text-zinc-300 line-clamp-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THE 4 SUBCOMMITTEES */}
        {['Academics', 'Events', 'Wellness', 'Research'].map(sub => (
          <div key={sub} className="mb-16">
            <h2 className="text-2xl font-colossus border-b-2 border-zinc-700 pb-2 mb-6 inline-block text-zinc-300">{sub} Subcommittee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getTeamMembers(sub).map(member => (
                <div key={member._id} className="bg-zinc-900 border border-zinc-800 hover:border-white transition-colors flex flex-col">
                  <img src={member.profilePic} alt={member.name} className="w-full aspect-square object-cover grayscale opacity-70 hover:opacity-100 transition-all" />
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg uppercase tracking-wider text-white">{member.name}</h3>
                    <p className="font-stencil text-xs text-zinc-500 mb-2">{member.title}</p>
                    <p className="font-sans text-xs font-light text-zinc-400 line-clamp-3 flex-grow">{member.bio}</p>
                  </div>
                </div>
              ))}
              {getTeamMembers(sub).length === 0 && (
                <p className="font-mono text-sm text-zinc-600">Personnel assignment pending...</p>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}