import { useState } from 'react';

const questions = [
  { q: "What does HTTP stand for?", a: "HyperText Transfer Protocol", options: ["HyperText Transfer Protocol", "HyperText Transmission Process", "HyperLink Transfer Protocol", "HyperText Test Protocol"] },
  { q: "Which of these is NOT a JavaScript framework/library?", a: "Django", options: ["React", "Vue", "Angular", "Django"] },
  { q: "What does SQL stand for?", a: "Structured Query Language", options: ["Structured Question Language", "Strong Query Language", "Structured Query Language", "Standard Query Logic"] },
  { q: "In Git, what command saves your changes to the local repository?", a: "git commit", options: ["git push", "git save", "git commit", "git add"] }
];

export default function TechTrivia({ onExit, onWin }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (selected) => {
    let newScore = score;
    if (selected === questions[currentQ].a) newScore = score + 1;
    setScore(newScore);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setGameOver(true);
      if (newScore >= 3) onWin(50); // 50 points for 3+ correct
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center font-consolas">
      <div className="flex justify-between items-center mb-8 border-b border-itss-gray pb-4">
        <h2 className="text-2xl font-stencil uppercase text-itss-warning">Tech Trivia</h2>
        <button onClick={onExit} className="bg-itss-danger/20 text-itss-danger border border-itss-danger px-4 py-1 text-xs font-bold uppercase hover:bg-itss-danger hover:text-white transition-colors">Abort</button>
      </div>

      {gameOver ? (
        <div className="py-10">
          <h3 className="text-3xl font-stencil mb-2 text-itss-white">EXAM COMPLETE</h3>
          <p className="mb-6">Score: {score} / {questions.length}</p>
          {score >= 3 ? <p className="text-itss-success font-bold mb-6">+50 POINTS SECURED</p> : <p className="text-itss-danger mb-6">Further study required.</p>}
          <button onClick={onExit} className="bg-itss-white text-itss-black px-8 py-3 font-bold uppercase">Return to Hub</button>
        </div>
      ) : (
        <div className="text-left">
          <p className="text-itss-warning text-sm mb-2 font-bold">Question {currentQ + 1} of {questions.length}</p>
          <h3 className="text-xl text-itss-white mb-6 h-16">{questions[currentQ].q}</h3>
          
          <div className="grid gap-3">
            {questions[currentQ].options.map((opt, i) => (
              <button 
                key={i} onClick={() => handleAnswer(opt)}
                className="bg-itss-dark border border-itss-gray text-zinc-300 p-4 text-left hover:bg-itss-warning hover:text-itss-black hover:border-itss-warning transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}