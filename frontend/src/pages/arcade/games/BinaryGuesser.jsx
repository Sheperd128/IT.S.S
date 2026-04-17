import { useState, useEffect } from 'react';

export default function BinaryGuesser({ onExit, onWin }) {
  const [decimal, setDecimal] = useState(0);
  const [binary, setBinary] = useState('');
  const [guess, setGuess] = useState('');
  const [won, setWon] = useState(false);

  useEffect(() => {
    const num = Math.floor(Math.random() * 15) + 1; // 1 to 15
    setDecimal(num);
    setBinary(num.toString(2));
  }, []);

  const handleGuess = (e) => {
    e.preventDefault();
    if (parseInt(guess) === decimal) {
      setWon(true);
      onWin(20); // 20 Points
    } else {
      alert('Incorrect calculation. Try again.');
      setGuess('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-colossus uppercase tracking-wider">Binary Decode</h2>
        <button onClick={onExit} className="bg-red-900/50 text-red-400 px-4 py-1 text-xs font-bold uppercase hover:bg-red-900">Abort</button>
      </div>

      {won ? (
        <div className="py-10">
          <h3 className="text-3xl font-colossus text-green-400 mb-2">+20 POINTS SECURED</h3>
          <p className="font-mono mb-6">Correct! {binary} = {decimal}</p>
          <button onClick={onExit} className="bg-white text-black px-8 py-3 font-bold uppercase shadow-magazine-dark">Return to Hub</button>
        </div>
      ) : (
        <div className="py-10">
          <p className="font-mono text-zinc-400 mb-2">Convert the binary string to a decimal number.</p>
          <h1 className="text-6xl font-mono tracking-widest text-green-400 mb-8">{binary}</h1>
          <form onSubmit={handleGuess} className="flex gap-2">
            <input 
              type="number" value={guess} onChange={e => setGuess(e.target.value)} autoFocus
              className="flex-1 bg-zinc-900 border border-zinc-700 p-3 text-white text-center font-mono text-xl focus:outline-none focus:border-white"
              placeholder="Base-10 number"
            />
            <button type="submit" className="bg-white text-black px-6 font-bold uppercase hover:bg-zinc-300">Verify</button>
          </form>
        </div>
      )}
    </div>
  );
}