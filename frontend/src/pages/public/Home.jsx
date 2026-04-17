import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content, setContent] = useState({
    heroWord1: 'UNITE.',
    heroWord2: 'BUILD.',
    heroWord3: 'INNOVATE.',
    heroSubtitle: 'Building an inclusive, innovative, and empowering community for all students within the IT faculty. No coder left behind.',
    announcementBadge: 'SYSTEM ONLINE'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/content');
        if (response.data) setContent(response.data);
      } catch (error) {
        console.error("Failed to load dynamic content", error);
      }
    };
    fetchContent();
  }, []);

  const handleExplore = () => {
    if (user) {
      navigate(user.team === 'Executive' ? '/admin' : '/arcade');
    } else {
      navigate('/join');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
      
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-12">
        
        <div className="w-full md:w-1/2 space-y-8 mt-4 md:mt-0">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-stencil leading-[1.1] text-itss-primary tracking-wider">
              <span className="cutout-text cutout-tilt-left mb-4 md:mb-6 inline-block">{content.heroWord1}</span><br />
              <span className="cutout-text cutout-tilt-right mb-4 md:mb-6 inline-block">{content.heroWord2}</span><br />
              <span className="cutout-text cutout-tilt-left inline-block">{content.heroWord3}</span>
            </h1>
          </div>
          
          <p className="text-base md:text-xl font-consolas max-w-lg leading-relaxed text-zinc-300 border-l-4 border-itss-primary pl-4">
            {content.heroSubtitle}
          </p>
          
          <div className="pt-6">
            <button 
              onClick={handleExplore} 
              className="bg-itss-primary text-itss-black w-full md:w-auto px-8 py-4 uppercase font-bold tracking-widest text-base md:text-lg hover:bg-itss-white transition-colors shadow-magazine-dark flex justify-center items-center gap-2"
            >
              Explore The Hub <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative flex justify-center">
          <div className="w-full max-w-md aspect-square bg-itss-dark border-4 border-itss-gray relative overflow-hidden flex items-center justify-center shadow-neon rounded-xl">
            <div className="absolute top-6 left-6 text-[10px] md:text-xs font-consolas tracking-widest text-itss-primary opacity-70">
              SYS_ONLINE // 2026
            </div>
            <div className="absolute bottom-6 right-6 text-[10px] md:text-xs font-consolas tracking-widest text-zinc-500">
              IT_STUDENT_SOCIETY
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-consolas font-bold text-itss-primary/20 text-glow select-none pointer-events-none leading-none">
              {`{ }`}
            </div>
            <div className="absolute bottom-12 -left-4 md:-left-6 bg-itss-white text-itss-black px-4 md:px-6 py-2 md:py-3 font-stencil tracking-widest uppercase transform -rotate-12 shadow-[4px_4px_0px_0px_var(--color-primary)] text-xs md:text-base border-2 border-itss-black z-10">
              {content.announcementBadge}
            </div>
          </div>
        </div>
      </div>

      {/* JOIN THE RANKS SECTION */}
      <div className="mt-24 md:mt-32 pt-16 border-t border-itss-gray">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-stencil text-itss-white uppercase tracking-widest mb-4">Join The Ranks</h2>
          <p className="font-consolas text-zinc-400 max-w-2xl mx-auto">Create an account to gain access to exclusive society features, track your operations, and compete against your peers.</p>
        </div>

        {/* THE FIX: Changed from grid-cols-3 to grid-cols-2 and added max-w-4xl mx-auto to center it perfectly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div className="bg-itss-dark border border-itss-gray p-8 text-center hover:border-itss-primary transition-colors group">
            <div className="w-16 h-16 mx-auto bg-itss-black border border-itss-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-xl font-stencil text-white uppercase mb-3">The Arcade</h3>
            <p className="text-sm font-consolas text-zinc-400">Access exclusive tech-themed minigames. Test your typing speed, reaction times, and coding logic.</p>
          </div>

          <div className="bg-itss-dark border border-itss-gray p-8 text-center hover:border-itss-primary transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-itss-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 mx-auto bg-itss-black border border-itss-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-xl font-stencil text-white uppercase mb-3 relative z-10">Leaderboards</h3>
            <p className="text-sm font-consolas text-zinc-400 relative z-10">Earn points for every challenge you complete. Climb the ranks to become the top hacker in the IT Faculty.</p>
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Home;