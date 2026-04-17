import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventsSub() {
  const [data, setData] = useState(null);
  const [team, setTeam] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, teamRes, eventRes] = await Promise.all([
          axios.get('https://itss-backend-upy6.onrender.com/api/operations/subcommittee/Events'),
          axios.get('https://itss-backend-upy6.onrender.com/api/users/public-team'),
          axios.get('https://itss-backend-upy6.onrender.com/api/operations/events')
        ]);
        setData(subRes.data);
        setTeam(teamRes.data.filter(member => member.team === 'Events'));
        setEvents(eventRes.data.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date)));
      } catch (error) { console.error("Fetch failed", error); }
    };
    fetchData();
  }, []);

  // Helper function to safely load both external web links and internal backend uploads
  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/') ? `https://itss-backend-upy6.onrender.com${url}` : url;
  };

  if (!data) return <div className="min-h-screen bg-itss-black text-itss-secondary flex justify-center items-center font-stencil text-2xl animate-pulse">Loading Event Matrix...</div>;

  return (
    <div className="min-h-screen bg-itss-black text-itss-white py-16 px-4 font-consolas">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-zinc-400 hover:text-white font-stencil text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">← Return to Home</Link>
        
        <div className="mb-16 border-l-4 border-itss-secondary pl-6">
          <h1 className="text-5xl md:text-7xl font-stencil text-white uppercase tracking-wider">{data.name}</h1>
          <p className="font-consolas tracking-widest text-itss-secondary mt-2">{data.tagline}</p>
        </div>

        <div className="bg-itss-dark border border-itss-gray p-8 shadow-neon mb-16">
          <h2 className="text-2xl font-stencil uppercase text-white mb-4 border-b border-itss-gray pb-2">Mission Directive</h2>
          <p className="font-consolas text-zinc-300 leading-relaxed">{data.mission}</p>
        </div>

        {/* CUSTOM MODULE: EVENT GALLERY */}
        <div className="mb-16">
          <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
            <Camera className="text-itss-secondary" size={32}/> Event Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery && data.gallery.length > 0 ? (
              data.gallery.map((img, i) => (
                <div key={i} className="relative group aspect-square overflow-hidden border-2 border-itss-gray hover:border-itss-secondary transition-colors">
                  {/* THE FIX IS HERE: Safely fetching the image URL */}
                  <img src={getImageUrl(img.url)} alt={img.caption} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110" />
                  <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs text-itss-white font-bold truncate">{img.caption}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full h-48 bg-itss-dark border border-itss-gray flex items-center justify-center text-zinc-500 italic">Gallery feed offline. No images captured.</div>
            )}
          </div>
        </div>

        {/* UPCOMING HIGHLIGHT */}
        {events.length > 0 && (
          <div className="mb-16 bg-itss-secondary/10 border border-itss-secondary p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl font-stencil uppercase text-itss-secondary mb-2 flex items-center gap-2"><Calendar size={20}/> Next Execution</h3>
              <p className="text-2xl font-bold text-white">{events[0].title}</p>
              <p className="text-zinc-400 text-sm mt-1">{new Date(events[0].date).toLocaleString()}</p>
            </div>
            <Link to="/events" className="bg-itss-secondary text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap">
              View Full Matrix
            </Link>
          </div>
        )}

        {/* MEET THE TEAM */}
        <div>
          <h2 className="text-3xl font-stencil uppercase text-white mb-8 flex items-center gap-3">
            <User className="text-itss-secondary" size={32}/> Event Architects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member._id} className="bg-itss-dark border border-itss-gray hover:border-itss-secondary transition-colors flex flex-col">
                {/* Applied the same fix to profile pictures just in case */}
                <img src={getImageUrl(member.profilePic)} alt={member.name} className="w-full aspect-square object-cover grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all" />
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg uppercase tracking-wider text-white">{member.name}</h3>
                  <p className="font-stencil text-xs text-itss-secondary mb-2">{member.title}</p>
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