import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { User, CheckCircle } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Cyber',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Matrix',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Hacker',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Glitch',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Neon',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Void',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nexus',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Byte',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Pixel',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Circuit',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Synth',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Data'
];

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  
  // Clean up any dirty database strings on initial load
  const initialPic = (!user?.profilePic || user.profilePic.includes('placeholder.com') || user.profilePic.includes('NO+IMAGE')) 
    ? AVATAR_PRESETS[0] 
    : user.profilePic;

  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    profilePic: initialPic
  });
  const [saveStatus, setSaveStatus] = useState('');

  const getImageUrl = (url) => {
    if (!url || url.includes('placeholder.com') || url.includes('NO+IMAGE')) {
      return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?._id || 'fallback'}`;
    }
    if (url.startsWith('/')) return `https://itss-backend-upy6.onrender.com${url}`;
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving Profile...');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://itss-backend-upy6.onrender.com/api/admin/users/${user._id}`, { ...user, ...formData }, config);
      
      const updatedUser = { ...user, bio: formData.bio, profilePic: formData.profilePic };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      setSaveStatus('Profile Secured.');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) { setSaveStatus('Error saving profile'); }
  };

  return (
    <div className="min-h-screen bg-itss-black text-itss-white py-16 px-4 font-consolas">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-l-4 border-itss-primary pl-4">
          <h1 className="text-4xl font-stencil uppercase tracking-widest text-white">Agent Profile</h1>
          <p className="text-zinc-400 text-sm">Configure your personal identity and avatar.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-itss-dark border border-itss-gray p-8 shadow-neon rounded-xl">
          <div className="flex justify-between items-center border-b border-itss-gray pb-4 mb-8">
            <h2 className="text-2xl font-stencil text-itss-primary flex items-center gap-2"><User size={24}/> Identity Matrix</h2>
            {saveStatus && <span className="font-mono text-itss-success text-sm animate-pulse flex items-center gap-1"><CheckCircle size={16}/> {saveStatus}</span>}
          </div>

          <div className="space-y-8">
            
            <div className="flex items-center gap-6 bg-itss-black p-4 border border-itss-gray">
              <img 
                src={getImageUrl(formData.profilePic)} 
                alt="Current" 
                className="w-20 h-20 bg-itss-dark border border-itss-primary object-cover p-1 shadow-magazine" 
                onError={(e) => { e.target.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?._id}` }}
              />
              <div>
                <p className="font-stencil uppercase tracking-widest text-white">{user?.name}</p>
                <p className="text-sm text-itss-primary font-bold">{user?.team} - {user?.title}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-4 uppercase tracking-widest">Select Agent Avatar</label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {AVATAR_PRESETS.map((avatarUrl, index) => (
                  <div 
                    key={index} 
                    onClick={() => setFormData({ ...formData, profilePic: avatarUrl })}
                    className={`cursor-pointer aspect-square rounded-lg border-4 transition-all duration-200 overflow-hidden bg-itss-black
                      ${formData.profilePic === avatarUrl ? 'border-itss-primary scale-105 shadow-magazine' : 'border-itss-gray hover:border-zinc-500 hover:scale-105'}`}
                  >
                    <img src={avatarUrl} alt={`Avatar ${index}`} className="w-full h-full object-contain p-2" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-2 uppercase tracking-widest">Personal Bio</label>
              <textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="w-full bg-itss-black border border-itss-gray p-4 text-white h-32 focus:border-itss-primary focus:outline-none" 
                placeholder="Tell the society about your stack, skills, and goals..." 
              />
            </div>

            <button type="submit" className="bg-itss-primary text-black font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-white transition-colors shadow-magazine-dark">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}