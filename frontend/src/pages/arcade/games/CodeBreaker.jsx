import { useState, useEffect } from 'react';

export default function CodeBreaker({ onExit, onWin }) {
  const [secretCode, setSecretCode] = useState('');
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    let code = '';
    while(code.length < 4) {
      let r = Math.floor(Math.random() * 9) + 1;
      if(code.indexOf(r) === -1) code += r;
    }
    setSecretCode(code);
  }, []);

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.length !== 4) return alert('Enter exactly 4 digits');
    if (new Set(guess).size !== 4) return alert('Digits must be unique');

    let bulls = 0; 
    let cows = 0;  

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretCode[i]) bulls++;
      else if (secretCode.includes(guess[i])) cows++;
    }

    setHistory([...history, { guess, bulls, cows }]);
    setGuess('');
    if (bulls === 4) {
      setWon(true);
      onWin(100); // 100 Points for Code Breaker!
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-colossus uppercase tracking-wider">Code Breaker</h2>
        <button onClick={onExit} className="bg-red-900/50 text-red-400 px-4 py-1 text-xs font-bold uppercase hover:bg-red-900">Abort</button>
      </div>

      <p className="font-mono text-zinc-400 text-sm mb-6 text-left">
        Crack the 4-digit firewall PIN (Digits 1-9, no duplicates). <br/>
        <span className="text-green-400">● Bulls:</span> Correct digit & position.<br/>
        <span className="text-yellow-400">○ Cows:</span> Correct digit, wrong position.
      </p>

      {won ? (
        <div className="py-10">
          <h3 className="text-3xl font-colossus text-green-400 mb-2">+100 POINTS SECURED</h3>
          <p className="font-mono mb-6">Code was: {secretCode}</p>
          <button onClick={onExit} className="bg-white text-black px-8 py-3 font-bold uppercase shadow-magazine-dark">Return to Hub</button>
        </div>
      ) : (
        <form onSubmit={handleGuess} className="mb-8 flex gap-2">
          <input 
            type="number" value={guess} onChange={e => setGuess(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 p-3 text-white text-center tracking-[0.5em] font-mono text-xl focus:outline-none focus:border-white"
            placeholder="----" maxLength="4"
          />
          <button type="submit" className="bg-white text-black px-6 font-bold uppercase hover:bg-zinc-300">Run</button>
        </form>
      )}

      <div className="space-y-2 text-left">
        {history.map((h, i) => (
          <div key={i} className="flex justify-between bg-zinc-900 p-3 border border-zinc-800 font-mono">
            <span className="tracking-[0.5em] text-lg">{h.guess}</span>
            <span className="text-sm">
              <span className="text-green-400 mr-2">{h.bulls} Bulls</span>
              <span className="text-yellow-400">{h.cows} Cows</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}