import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function SubcommitteeEditor() {
  const { user } = useContext(AuthContext);
  
  const [selectedTeam, setSelectedTeam] = useState(user.team === 'Executive' ? 'Academics' : user.team);
  const [formData, setFormData] = useState({ 
    tagline: '', mission: '', initiatives: ['', '', '', ''],
    resources: [], gallery: [], announcements: []
  });
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => { fetchSubInfo(); }, [selectedTeam]);

  const fetchSubInfo = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`http://localhost:5000/api/operations/subcommittee/${selectedTeam}`, config);
      
      const inits = data.initiatives || [];
      while (inits.length < 4) inits.push('');
      
      setFormData({ 
        tagline: data.tagline || '', 
        mission: data.mission || '', 
        initiatives: inits,
        resources: data.resources || [],
        gallery: data.gallery || [],
        announcements: data.announcements || []
      });
    } catch (error) { console.error('Failed to fetch info'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('Encrypting Payload...');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/operations/subcommittee/${selectedTeam}`, formData, config);
      setSaveStatus('Data Secured.');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) { setSaveStatus('Error saving'); }
  };

  // --- DYNAMIC ARRAY HANDLERS ---
  const handleArrayChange = (arrayName, index, field, value) => {
    const updated = [...formData[arrayName]];
    updated[index][field] = value;
    setFormData({ ...formData, [arrayName]: updated });
  };

  const addArrayItem = (arrayName, template) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], template] });
  };

  const removeArrayItem = (arrayName, index) => {
    const updated = [...formData[arrayName]];
    updated.splice(index, 1);
    setFormData({ ...formData, [arrayName]: updated });
  };

  // --- GALLERY IMAGE UPLOAD HANDLER ---
  const handleGalleryUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('document', file); 

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/upload', uploadData, config);
      // Update the URL field with the uploaded file path
      handleArrayChange('gallery', index, 'url', `http://localhost:5000${data}`);
    } catch (error) {
      alert('File upload failed. Ensure it is a valid format (.jpg, .png).');
    }
  };

  return (
    <div className="text-itss-white font-consolas">
      <div className="mb-8 border-l-4 border-itss-primary pl-4">
        <h1 className="text-4xl font-stencil uppercase text-white tracking-widest">Profile Editor</h1>
        <p className="text-zinc-400 text-sm">Modify public-facing sub-pages without writing code.</p>
      </div>

      <div className="bg-itss-dark border border-itss-gray p-6 md:p-8 shadow-neon">
        
        {user.team === 'Executive' && (
          <div className="mb-8 p-4 bg-itss-black border border-itss-gray">
            <label className="text-xs font-stencil text-itss-danger uppercase mr-4">Executive Override Target:</label>
            <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className="bg-itss-dark text-white p-2 font-bold uppercase border border-itss-gray focus:outline-none">
              <option value="Academics">Academics</option>
              <option value="Events">Events</option>
              <option value="Wellness">Wellness</option>
              <option value="Research">Research</option>
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-between items-center border-b border-itss-gray pb-2">
            <h2 className="text-3xl font-stencil uppercase text-itss-primary">{selectedTeam} Core</h2>
            {saveStatus && <span className="font-mono text-itss-success text-sm animate-pulse">{saveStatus}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-2 uppercase">Tagline / Slogan</label>
              <input type="text" value={formData.tagline} onChange={e=>setFormData({...formData, tagline: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary" />
            </div>
            <div>
              <label className="block text-xs font-stencil text-zinc-400 mb-2 uppercase">Mission Statement</label>
              <textarea value={formData.mission} onChange={e=>setFormData({...formData, mission: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white h-24 focus:outline-none focus:border-itss-primary" />
            </div>
          </div>

          <div className="border-t border-itss-gray pt-8">
            <h3 className="text-xl font-stencil uppercase text-white mb-6">Dynamic Modules</h3>

            {/* Academics & Research Module: Resources */}
            {(selectedTeam === 'Academics' || selectedTeam === 'Research') && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-zinc-400 font-stencil text-sm">Downloadable Templates & Resources</p>
                  <button type="button" onClick={() => addArrayItem('resources', { title: '', url: '' })} className="flex items-center gap-1 text-xs text-itss-primary hover:text-white uppercase"><Plus size={14}/> Add Resource</button>
                </div>
                {formData.resources.map((res, i) => (
                  <div key={i} className="flex gap-4 items-center bg-itss-black p-3 border border-itss-gray">
                    <input type="text" placeholder="Resource Title" value={res.title} onChange={e => handleArrayChange('resources', i, 'title', e.target.value)} className="w-1/3 bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-primary text-sm" />
                    <input type="text" placeholder="File Link (Google Drive, etc.)" value={res.url} onChange={e => handleArrayChange('resources', i, 'url', e.target.value)} className="flex-1 bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-primary text-sm" />
                    <button type="button" onClick={() => removeArrayItem('resources', i)} className="text-zinc-500 hover:text-itss-danger"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* Events Module: Gallery */}
            {selectedTeam === 'Events' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-zinc-400 font-stencil text-sm">Event Photo Gallery</p>
                  <button type="button" onClick={() => addArrayItem('gallery', { url: '', caption: '' })} className="flex items-center gap-1 text-xs text-itss-secondary hover:text-white uppercase"><Plus size={14}/> Add Image Space</button>
                </div>
                {formData.gallery.map((img, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-itss-black p-4 border border-itss-gray relative">
                    <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
                      <span className="text-xs font-stencil text-itss-secondary">Image Slot {i + 1}</span>
                      <button type="button" onClick={() => removeArrayItem('gallery', i)} className="text-zinc-500 hover:text-itss-danger"><Trash2 size={16}/></button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1 w-full space-y-2">
                        <input type="text" placeholder="Paste Image URL..." value={img.url} onChange={e => handleArrayChange('gallery', i, 'url', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-secondary text-sm pb-1" />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 font-stencil uppercase">OR UPLOAD:</span>
                          <input type="file" accept="image/*" onChange={(e) => handleGalleryUpload(e, i)} className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-bold file:bg-itss-secondary file:text-black hover:file:bg-white cursor-pointer" />
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full">
                        <input type="text" placeholder="Image Caption (Required)" value={img.caption} onChange={e => handleArrayChange('gallery', i, 'caption', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-secondary text-sm pb-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wellness Module: Announcements */}
            {selectedTeam === 'Wellness' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-zinc-400 font-stencil text-sm">Wellness Logs & Tips</p>
                  <button type="button" onClick={() => addArrayItem('announcements', { title: '', text: '' })} className="flex items-center gap-1 text-xs text-itss-success hover:text-white uppercase"><Plus size={14}/> Add Log</button>
                </div>
                {formData.announcements.map((ann, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-itss-black p-3 border border-itss-gray relative">
                    <input type="text" placeholder="Log Title" value={ann.title} onChange={e => handleArrayChange('announcements', i, 'title', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-success font-bold" />
                    <textarea placeholder="Log Content" value={ann.text} onChange={e => handleArrayChange('announcements', i, 'text', e.target.value)} className="w-full bg-transparent border-b border-zinc-700 text-white focus:outline-none focus:border-itss-success text-sm h-16" />
                    <button type="button" onClick={() => removeArrayItem('announcements', i)} className="absolute top-3 right-3 text-zinc-500 hover:text-itss-danger"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-8 py-4 w-full hover:bg-white transition-colors shadow-magazine-dark">
            Push Directives to Live Site
          </button>
        </form>
      </div>
    </div>
  );
}