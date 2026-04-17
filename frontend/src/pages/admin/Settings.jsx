import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';
import { Palette, Type, CheckCircle } from 'lucide-react';

const THEME_PRESETS = {
  Default: { primary: '#9DCD5A', secondary: '#b388ff', success: '#00e676', warning: '#ffea00', danger: '#ff1744', orange: '#ff9100' },
  Valentine: { primary: '#ff4081', secondary: '#f50057', success: '#00e676', warning: '#ffea00', danger: '#c51162', orange: '#ff9100' },
  Easter: { primary: '#b2fab4', secondary: '#ff80ab', success: '#81c784', warning: '#ffd54f', danger: '#ff9e80', orange: '#ffb74d' },
  Halloween: { primary: '#ff9100', secondary: '#651fff', success: '#00e676', warning: '#ffea00', danger: '#ff1744', orange: '#ff6d00' },
  Christmas: { primary: '#00e676', secondary: '#ff1744', success: '#1b5e20', warning: '#ffea00', danger: '#d50000', orange: '#ff9100' }
};

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { applyThemeToDOM } = useContext(ThemeContext);
  
  const [siteContent, setSiteContent] = useState({ 
    heroWord1: '', heroWord2: '', heroWord3: '', heroSubtitle: '', announcementBadge: '',
    themeConfig: { preset: 'Default', colors: THEME_PRESETS.Default }
  });
  
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('https://itss-backend-upy6.onrender.com/api/admin/content');
        if (data) setSiteContent(data);
      } catch (error) { console.error("Fetch error"); }
    };
    fetchContent();
  }, []);

  const handleColorChange = (key, value) => {
    const newColors = { ...siteContent.themeConfig.colors, [key]: value };
    const newConfig = { preset: 'Custom', colors: newColors };
    setSiteContent({ ...siteContent, themeConfig: newConfig });
    applyThemeToDOM(newColors); // Show preview instantly
  };

  const applyPreset = (presetName) => {
    const newConfig = { preset: presetName, colors: THEME_PRESETS[presetName] };
    setSiteContent({ ...siteContent, themeConfig: newConfig });
    applyThemeToDOM(THEME_PRESETS[presetName]); // Show preview instantly
  };

  const handleContentUpdate = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving to Database...');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('https://itss-backend-upy6.onrender.com/api/admin/content', siteContent, config);
      setSaveStatus('Configuration Locked!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) { setSaveStatus('Error saving'); }
  };

  return (
    <div className="text-itss-white font-consolas pb-20">
      <div className="mb-8 border-l-4 border-itss-primary pl-4 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-stencil uppercase tracking-widest text-itss-white">Frontend Override</h1>
          <p className="text-zinc-400 text-sm">Control public text and dynamic aesthetics.</p>
        </div>
        {saveStatus && <span className="font-stencil text-itss-success text-sm animate-pulse flex items-center gap-1"><CheckCircle size={16}/> {saveStatus}</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TEXT OVERRIDE MODULE */}
        <div className="bg-itss-dark border border-itss-gray p-6 md:p-8 shadow-neon">
          <h2 className="text-xl font-stencil uppercase text-itss-white mb-6 flex items-center gap-2 border-b border-itss-gray pb-2">
            <Type size={20} className="text-itss-primary"/> Copywriting Engine
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-stencil text-xs text-zinc-400 mb-1">Word 1</label>
                <input type="text" value={siteContent.heroWord1} onChange={e => setSiteContent({...siteContent, heroWord1: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary" />
              </div>
              <div>
                <label className="block font-stencil text-xs text-zinc-400 mb-1">Word 2</label>
                <input type="text" value={siteContent.heroWord2} onChange={e => setSiteContent({...siteContent, heroWord2: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary" />
              </div>
              <div>
                <label className="block font-stencil text-xs text-zinc-400 mb-1">Word 3</label>
                <input type="text" value={siteContent.heroWord3} onChange={e => setSiteContent({...siteContent, heroWord3: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary" />
              </div>
            </div>
            <div>
              <label className="block font-stencil text-xs text-zinc-400 mb-1">Hero Subtitle</label>
              <textarea value={siteContent.heroSubtitle} onChange={e => setSiteContent({...siteContent, heroSubtitle: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary h-24" />
            </div>
            <div>
              <label className="block font-stencil text-xs text-zinc-400 mb-1">Urgent Announcement Badge</label>
              <input type="text" value={siteContent.announcementBadge} onChange={e => setSiteContent({...siteContent, announcementBadge: e.target.value})} className="w-full bg-itss-black border border-itss-gray p-3 text-white focus:outline-none focus:border-itss-primary" />
            </div>
          </div>
        </div>

        {/* DYNAMIC THEMING MODULE */}
        <div className="bg-itss-dark border border-itss-gray p-6 md:p-8 shadow-neon">
          <h2 className="text-xl font-stencil uppercase text-itss-white mb-6 flex items-center gap-2 border-b border-itss-gray pb-2">
            <Palette size={20} className="text-itss-primary"/> Color Matrix Core
          </h2>
          
          <div className="mb-6">
            <label className="block font-stencil text-xs text-zinc-400 mb-3 uppercase">Seasonal Packages</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(THEME_PRESETS).map(preset => (
                <button 
                  key={preset} 
                  onClick={() => applyPreset(preset)}
                  className={`px-4 py-2 font-stencil text-xs uppercase tracking-widest border transition-all ${siteContent.themeConfig?.preset === preset ? 'bg-itss-primary text-black border-itss-primary scale-105' : 'bg-itss-black text-zinc-400 border-itss-gray hover:border-itss-primary hover:text-white'}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-stencil text-xs text-zinc-400 mb-3 uppercase">Fine-Tune Matrix (Color Wheel)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(THEME_PRESETS.Default).map(colorKey => (
                <div key={colorKey} className="bg-itss-black border border-itss-gray p-3 flex flex-col items-center">
                  <span className="text-[10px] font-stencil uppercase text-zinc-500 mb-2">{colorKey}</span>
                  <input 
                    type="color" 
                    value={siteContent.themeConfig?.colors?.[colorKey] || '#ffffff'}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="w-full h-10 bg-transparent cursor-pointer border-0 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <button onClick={handleContentUpdate} className="mt-8 bg-itss-primary text-itss-black font-bold uppercase tracking-widest px-12 py-4 w-full hover:bg-white transition-colors shadow-magazine-dark text-lg">
        Execute & Broadcast Changes
      </button>

    </div>
  );
}