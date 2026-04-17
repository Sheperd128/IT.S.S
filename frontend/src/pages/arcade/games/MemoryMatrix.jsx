import { useState, useEffect } from 'react';

const cardElements = ['{ }', '< >', '()', '[]', '///', '&&', '||', '!='];

export default function MemoryMatrix({ onExit, onWin }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const shuffledCards = [...cardElements, ...cardElements]
      .sort(() => Math.random() - 0.5)
      .map((element, index) => ({ id: index, element }));
    setCards(shuffledCards);
  }, []);

  const handleClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].element === cards[newFlipped[1]].element;
      
      if (match) {
        const newSolved = [...solved, ...newFlipped];
        setSolved(newSolved);
        setFlipped([]);
        if (newSolved.length === cards.length) {
          setWon(true);
          onWin(50); // Award 50 points!
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-colossus uppercase tracking-wider">Memory Matrix</h2>
        <div className="font-mono text-zinc-400">Moves: {moves}</div>
        <button onClick={onExit} className="bg-red-900/50 text-red-400 px-4 py-1 text-xs font-bold uppercase hover:bg-red-900">Abort</button>
      </div>

      {won ? (
        <div className="py-20">
          <h3 className="text-4xl font-colossus text-green-400 mb-4">+50 POINTS SECURED</h3>
          <p className="font-mono mb-8">You completed the matrix in {moves} moves.</p>
          <button onClick={onExit} className="bg-white text-black px-8 py-3 font-bold uppercase shadow-magazine-dark">Return to Hub</button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index);
            return (
              <div 
                key={card.id} 
                onClick={() => handleClick(index)}
                className={`aspect-square flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 ${
                  isFlipped ? 'bg-white text-black' : 'bg-zinc-800 text-transparent hover:bg-zinc-700'
                } ${solved.includes(index) ? 'opacity-50' : ''}`}
              >
                {isFlipped ? card.element : '?'}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}