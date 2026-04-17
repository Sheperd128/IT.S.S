import { useState, useEffect } from 'react';

export default function HexMatch({ onExit, onWin }) {
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();

  const setupRound = () => {
    const correct = generateHex();
    setTargetColor(correct);
    const choices = [correct, generateHex(), generateHex()].sort(() => Math.random() - 0.5);
    setOptions(choices);
  };

  useEffect(() => { setupRound(); }, []);

  const handlePick = (color) => {
    if (color === targetColor) setScore(s => s + 1);
    
    if (round < 5) {
      setRound(r => r + 1);
      setupRound();
    } else {
      setGameOver(true);
      if (score + (color === targetColor ? 1 : 0) >= 4) onWin(30); // 30 points for 4/5 correct
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center font-consolas">
      <div className="flex justify-between items-center mb-8 border-b border-itss-gray pb-4">
        <h2 className="text-2xl font-stencil uppercase text-itss-secondary">Hex Match</h2>
        <button onClick={onExit} className="bg-itss-danger/20 text-itss-danger border border-itss-danger px-4 py-1 text-xs font-bold uppercase hover:bg-itss-danger hover:text-white transition-colors">Abort</button>
      </div>

      {gameOver ? (
        <div className="py-10">
          <h3 className="text-3xl font-stencil mb-2 text-itss-white">VISION TEST COMPLETE</h3>
          <p className="mb-6">Accuracy: {score} / 5</p>
          {score >= 4 ? <p className="text-itss-success font-bold mb-6">+30 POINTS SECURED</p> : <p className="text-itss-danger mb-6">Frontend skills require calibration.</p>}
          <button onClick={onExit} className="bg-itss-white text-itss-black px-8 py-3 font-bold uppercase">Return to Hub</button>
        </div>
      ) : (
        <div className="py-6">
          <p className="text-zinc-400 mb-2">Round {round} of 5. Identify the correct hex code for this color.</p>
          <div className="w-full h-48 rounded-lg shadow-neon mb-8 border-2 border-itss-gray" style={{ backgroundColor: targetColor }}></div>
          <div className="grid grid-cols-1 gap-4">
            {options.map((hex, i) => (
              <button 
                key={i} onClick={() => handlePick(hex)}
                className="bg-itss-dark border border-itss-gray text-itss-white py-4 font-bold tracking-widest hover:bg-itss-secondary hover:text-itss-black transition-colors"
              >
                {hex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}