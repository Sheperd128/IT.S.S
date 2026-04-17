import { useState, useRef } from 'react';

export default function ServerPing({ onExit, onWin }) {
  const [state, setState] = useState('idle'); // idle, waiting, ready, done
  const [message, setMessage] = useState('Click to ping the server.');
  const [reactionTime, setReactionTime] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleClick = () => {
    if (state === 'idle') {
      setState('waiting');
      setMessage('Wait for green connection...');
      // Random wait between 2 to 5 seconds
      const delay = Math.floor(Math.random() * 3000) + 2000;
      timerRef.current = setTimeout(() => {
        setState('ready');
        setMessage('CLICK NOW!');
        startTimeRef.current = Date.now();
      }, delay);
    } else if (state === 'waiting') {
      clearTimeout(timerRef.current);
      setState('idle');
      setMessage('Too early! Connection dropped. Click to retry.');
    } else if (state === 'ready') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setState('done');
      if (time < 350) {
        setMessage(`Excellent latency: ${time}ms.`);
        onWin(25); // 25 points for sub-350ms
      } else {
        setMessage(`High latency: ${time}ms. Server timeout.`);
      }
    } else if (state === 'done') {
      setState('idle');
      setMessage('Click to ping the server.');
      setReactionTime(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center font-consolas">
      <div className="flex justify-between items-center mb-8 border-b border-itss-gray pb-4">
        <h2 className="text-2xl font-stencil uppercase text-itss-primary">Server Ping</h2>
        <button onClick={onExit} className="bg-itss-danger/20 text-itss-danger border border-itss-danger px-4 py-1 text-xs font-bold uppercase hover:bg-itss-danger hover:text-white transition-colors">Abort</button>
      </div>

      <p className="text-zinc-400 mb-6">Test your network reflexes. Click as soon as the terminal turns green. Sub-350ms required to earn points.</p>

      <div 
        onClick={handleClick}
        className={`w-full h-64 border-2 flex items-center justify-center cursor-pointer select-none transition-colors duration-100
          ${state === 'idle' ? 'bg-itss-dark border-itss-gray text-itss-white hover:bg-zinc-800' : ''}
          ${state === 'waiting' ? 'bg-itss-danger/20 border-itss-danger text-itss-danger' : ''}
          ${state === 'ready' ? 'bg-itss-success border-itss-success text-itss-black shadow-neon' : ''}
          ${state === 'done' ? 'bg-itss-dark border-itss-primary text-itss-primary' : ''}
        `}
      >
        <h3 className="text-2xl font-bold uppercase tracking-widest px-4">{message}</h3>
      </div>

      {state === 'done' && reactionTime < 350 && (
        <div className="mt-8 text-itss-success font-bold animate-pulse">+25 POINTS SECURED</div>
      )}
    </div>
  );
}