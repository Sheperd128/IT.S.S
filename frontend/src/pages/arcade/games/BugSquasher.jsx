import { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';

export default function BugSquasher({ onExit, onWin }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [activeBug, setActiveBug] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setScore(0); setTimeLeft(20); setIsPlaying(true); setGameOver(false);
    moveBug();
  };

  const moveBug = () => setActiveBug(Math.floor(Math.random() * 16));

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      const bugTimer = setTimeout(moveBug, 800); // Bug moves every 800ms
      return () => { clearTimeout(timer); clearTimeout(bugTimer); };
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false); setGameOver(true);
      if (score >= 15) onWin(40); // 40 points for 15+ bugs
    }
  }, [timeLeft, isPlaying, score, onWin]);

  const squashBug = (index) => {
    if (index === activeBug) {
      setScore(s => s + 1);
      setActiveBug(null); // Hide bug instantly when squashed
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center font-consolas">
      <div className="flex justify-between items-center mb-8 border-b border-itss-gray pb-4">
        <h2 className="text-2xl font-stencil uppercase text-itss-success">Bug Squasher</h2>
        <button onClick={onExit} className="bg-itss-danger/20 text-itss-danger border border-itss-danger px-4 py-1 text-xs font-bold uppercase hover:bg-itss-danger hover:text-white transition-colors">Abort</button>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="py-10">
          <p className="text-zinc-400 mb-6">Production is full of bugs. Squash 15+ bugs in 20 seconds to stabilize the deployment.</p>
          <button onClick={startGame} className="bg-itss-success text-itss-black px-8 py-3 font-bold uppercase hover:bg-white transition-colors">Deploy Fix</button>
        </div>
      ) : gameOver ? (
        <div className="py-10">
          <h3 className="text-3xl font-stencil mb-2 text-itss-white">DEPLOYMENT {score >= 15 ? 'STABLE' : 'FAILED'}</h3>
          <p className="mb-6">Bugs Squashed: {score}</p>
          {score >= 15 ? <p className="text-itss-success font-bold mb-6">+40 POINTS SECURED</p> : <p className="text-itss-danger mb-6">Insufficient debugging skills.</p>}
          <button onClick={onExit} className="bg-itss-white text-itss-black px-8 py-3 font-bold uppercase">Return to Hub</button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-xl mb-6">
            <span className="text-itss-primary">Time: {timeLeft}s</span>
            <span className="text-itss-success">Squashed: {score}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                onClick={() => squashBug(i)}
                className={`aspect-square border border-itss-gray flex items-center justify-center cursor-pointer transition-colors ${activeBug === i ? 'bg-itss-danger/20 hover:bg-itss-danger/40' : 'bg-itss-black'}`}
              >
                {activeBug === i && <Bug size={32} className="text-itss-danger animate-bounce" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}