import { useState, useEffect, useRef } from 'react';

const words = ['function', 'compile', 'server', 'database', 'frontend', 'latency', 'bandwidth', 'variable', 'syntax', 'boolean', 'algorithm', 'payload', 'iteration', 'framework'];

export default function TerminalTyping({ onExit, onWin }) {
  const [targetWord, setTargetWord] = useState('initialize'); // Pre-loaded safe word
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    setGameOver(false);
    setInput('');
    nextWord();
    // Focus the input safely after React renders it
    setTimeout(() => inputRef.current?.focus(), 100); 
  };

  const nextWord = () => {
    setTargetWord(words[Math.floor(Math.random() * words.length)]);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
      if (score >= 5) onWin(score * 10); 
    }
  }, [timeLeft, isPlaying, score, onWin]);

  const handleChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setInput(val);
    if (val === targetWord) {
      setScore(s => s + 1);
      setInput('');
      nextWord();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center font-consolas">
      <div className="flex justify-between items-center mb-8 border-b border-itss-gray pb-4">
        <h2 className="text-2xl font-stencil uppercase tracking-wider text-itss-primary">Speed Typer</h2>
        <button onClick={onExit} className="bg-itss-danger/20 text-itss-danger px-4 py-1 text-xs font-bold uppercase border border-itss-danger hover:bg-itss-danger hover:text-itss-white transition-colors">Abort</button>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="py-10">
          <p className="text-zinc-400 mb-6">Type as many tech words as possible in 15 seconds. Score 5+ to earn points.</p>
          <button onClick={startGame} className="bg-itss-primary text-itss-black px-8 py-3 font-bold uppercase shadow-magazine-dark hover:bg-itss-white transition-colors">Start Protocol</button>
        </div>
      ) : gameOver ? (
        <div className="py-10">
          <h3 className="text-3xl font-stencil mb-2 text-itss-white">TIME EXPIRED</h3>
          <p className="mb-6">Words compiled: {score}</p>
          {score >= 5 ? (
            <p className="text-itss-primary font-bold mb-6">+{score * 10} POINTS SECURED</p> 
          ) : (
            <p className="text-itss-danger mb-6">Insufficient compilation speed.</p>
          )}
          <button onClick={onExit} className="bg-itss-white text-itss-black px-8 py-3 font-bold uppercase shadow-magazine-dark">Return to Hub</button>
        </div>
      ) : (
        <div className="py-10">
          <div className="flex justify-between text-xl mb-8">
            <span className="text-itss-warning">Time: {timeLeft}s</span>
            <span className="text-itss-primary">Score: {score}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-consolas tracking-widest mb-8 text-itss-white">{targetWord}</h1>
          <input 
            ref={inputRef}
            type="text" 
            value={input} 
            onChange={handleChange}
            className="w-full bg-itss-dark border-2 border-itss-gray p-4 text-itss-white text-center font-consolas text-2xl focus:outline-none focus:border-itss-primary shadow-neon"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
}