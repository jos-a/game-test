
import { useState, useEffect } from 'react';
import { GameEngine } from '../components/GameEngine';
import { HealthBar } from '../components/HealthBar';
import { useGameStore } from '../hooks/useGameStore';
import { Character } from '../types/game';

export const GamePage: React.FC = () => {
  const { 
    player1, 
    player2, 
    gameMode, 
    setWinner, 
    winner, 
    phase,
    resetGame,
    setPhase 
  } = useGameStore();
  
  const [localPlayer1, setLocalPlayer1] = useState<Character | null>(player1);
  const [localPlayer2, setLocalPlayer2] = useState<Character | null>(player2);

  useEffect(() => {
    if (player1) setLocalPlayer1(player1);
    if (player2) setLocalPlayer2(player2);
  }, [player1, player2]);

  const handleUpdatePlayers = (p1: Character, p2: Character) => {
    setLocalPlayer1(p1);
    setLocalPlayer2(p2);
  };

  if (phase === 'gameOver' && winner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <h1 
          className="text-5xl font-bold mb-8"
          style={{ 
            color: winner === 'player1' ? '#00d9ff' : '#e94560',
            textShadow: `0 0 30px ${winner === 'player1' ? '#00d9ff' : '#e94560'}`,
          }}
        >
          {winner === 'player1' ? 'Player 1' : gameMode === '2player' ? 'Player 2' : 'CPU'} WINS!
        </h1>
        
        <div className="flex gap-4">
          <button
            onClick={() => setPhase('menu')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            MAIN MENU
          </button>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gradient-to-r from-[#e94560] to-[#00d9ff] text-white font-bold rounded-lg hover:scale-110 transition-all duration-300 shadow-lg"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] p-4">
      <div className="w-full max-w-4xl flex justify-between items-start mb-4">
        {localPlayer1 && <HealthBar character={localPlayer1} playerNumber={1} />}
        <button
          onClick={() => setPhase('menu')}
          className="px-4 py-2 bg-gray-700/80 text-white rounded-lg hover:bg-gray-600 transition-all text-sm"
        >
          EXIT GAME
        </button>
        {localPlayer2 && <HealthBar character={localPlayer2} playerNumber={gameMode === '2player' ? 2 : 2} />}
      </div>

      {player1 && player2 && (
        <GameEngine
          player1={player1}
          player2={player2}
          gameMode={gameMode}
          onUpdatePlayers={handleUpdatePlayers}
          onGameOver={setWinner}
        />
      )}

      <div className="mt-4 text-gray-500 text-xs text-center">
        <p>Player 1: W/A/D to move | F to attack</p>
        {gameMode === '2player' && <p>Player 2: Arrow keys to move | J to attack</p>}
      </div>
    </div>
  );
};
