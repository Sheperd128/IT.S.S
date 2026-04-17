import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Games
import MemoryMatrix from './games/MemoryMatrix';
import CodeBreaker from './games/CodeBreaker';
import TerminalTyping from './games/TerminalTyping';
import BinaryGuesser from './games/BinaryGuesser';
import BugSquasher from './games/BugSquasher';
import HexMatch from './games/HexMatch';
import ServerPing from './games/ServerPing';
import TechTrivia from './games/TechTrivia';

const ArcadeHub = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeGame, setActiveGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/leaderboard');
        setLeaderboard(res.data);
      } catch (error) { console.error("Failed to load leaderboard"); }
    };
    fetchLeaderboard();
  }, [activeGame]); 

  const handleWin = async (pointsEarned) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put('http://localhost:5000/api/users/points', { points: pointsEarned }, config);
      const updatedUser = { ...user, stats: { ...user.stats, points: res.data.points } };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) { console.error("Failed to save points"); }
  };

  // THE FIX: Aggressive filter to block dead links and placeholders
  const getAvatarUrl = (url, fallbackSeed) => {
    if (!url || url.includes('placeholder.com') || url.includes('NO+IMAGE')) {
      return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${fallbackSeed}`;
    }
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return url;
  };

  const gamesList = [
    { id: 'memory', component: <MemoryMatrix onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'breaker', component: <CodeBreaker onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'typer', component: <TerminalTyping onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'binary', component: <BinaryGuesser onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'bug', component: <BugSquasher onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'hex', component: <HexMatch onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'ping', component: <ServerPing onExit={() => setActiveGame(null)} onWin={handleWin} /> },
    { id: 'trivia', component: <TechTrivia onExit={() => setActiveGame(null)} onWin={handleWin} /> }
  ];

  const launchRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * gamesList.length);
    setActiveGame(gamesList[randomIndex]);
  };

  if (activeGame) {
    return <div className="min-h-screen bg-itss-black text-itss-white pt-6">{activeGame.component}</div>;
  }

  return (
    <div className="min-h-screen bg-itss-black px-4 py-12 text-itss-white font-consolas">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-zinc-400 hover:text-white font-stencil text-xs uppercase mb-8 inline-block border-b border-zinc-600 pb-1">
          ← Return to Main Website
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-stencil text-itss-primary uppercase tracking-wider mb-4">The Arcade</h1>
          <p className="font-consolas text-zinc-400">Welcome, {user?.name}. Complete daily challenges to rank up.</p>
          <div className="mt-4 inline-block border-2 border-itss-primary px-6 py-2 shadow-neon bg-itss-dark">
            <span className="font-stencil uppercase tracking-widest text-sm text-white">Total Points: </span>
            <span className="font-bold text-xl text-itss-primary ml-2">{user?.stats?.points || 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 bg-itss-dark border border-itss-gray p-8 text-center flex flex-col justify-center items-center shadow-lg rounded-xl">
            <h2 className="text-3xl font-stencil text-itss-primary uppercase mb-4">Daily Challenge</h2>
            <p className="text-zinc-400 font-consolas text-sm mb-8 max-w-md">The system will select 1 of 8 randomized challenges for you to complete. Survive to earn points.</p>
            <button onClick={launchRandomGame} className="bg-itss-primary text-black text-xl font-stencil uppercase tracking-widest px-12 py-4 hover:bg-white hover:scale-105 transition-all shadow-magazine border-2 border-transparent hover:border-itss-primary">
              [ Initialize Challenge ]
            </button>
          </div>

          <div className="bg-itss-dark border border-itss-gray p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-xl font-stencil uppercase mb-4 border-b border-itss-gray pb-2 text-itss-primary">Top 10 Hackers</h2>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((player, index) => (
                <div key={player._id} className="flex items-center gap-4 bg-itss-black p-2 border border-itss-gray hover:border-itss-primary transition-colors">
                  <div className="font-stencil text-xl text-zinc-600 w-6 text-center">{index + 1}</div>
                  
                  <div className="w-10 h-10 bg-itss-dark border border-zinc-700 rounded-sm overflow-hidden flex-shrink-0">
                    <img 
                      src={getAvatarUrl(player.profilePic, player._id)} 
                      alt="avatar" 
                      className="w-full h-full object-cover" 
                      // FINAL FAILSAFE: If the image breaks, immediately swap it
                      onError={(e) => { e.target.src = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${player._id}` }}
                    />
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm uppercase truncate text-white">{player.name}</p>
                    <p className="text-[10px] font-consolas text-zinc-500 truncate">{player.team}</p>
                  </div>
                  <div className="font-consolas text-itss-primary font-bold">{player.stats.points}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArcadeHub;