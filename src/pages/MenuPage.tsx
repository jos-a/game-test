
import { useGameStore } from '../hooks/useGameStore';
import { CHARACTERS } from '../types/game';

export const MenuPage: React.FC = () => {
  const { 
    phase, 
    setPhase, 
    selectCharacter, 
    selectedCharacter1, 
    selectedCharacter2,
    setGameMode,
    gameMode,
    initializeGame 
  } = useGameStore();

  if (phase === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <h1 
          className="text-5xl font-bold mb-12 animate-pulse"
          style={{ 
            color: '#e94560',
            textShadow: '0 0 20px #e94560, 0 0 40px #e94560',
            fontFamily: "'Press Start 2P', cursive"
          }}
        >
          LITTLE FIGHTER
        </h1>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setPhase('characterSelect')}
            className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-[#e94560] to-[#ff6b8a] text-white rounded-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.6)]"
          >
            START GAME
          </button>
        </div>

        <div className="mt-12 text-gray-400 text-sm text-center max-w-md">
          <p className="mb-2">Player 1: W/A/D to move, F to attack</p>
          <p>Player 2: Arrow keys to move, J to attack</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] p-8">
      <h2 className="text-3xl font-bold mb-8 text-cyan-400" style={{ textShadow: '0 0 10px #00d9ff' }}>
        SELECT CHARACTER
      </h2>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setGameMode('cpu')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            gameMode === 'cpu' 
              ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,255,0.6)]' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          VS CPU
        </button>
        <button
          onClick={() => setGameMode('2player')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            gameMode === '2player' 
              ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(233,69,96,0.6)]' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          2 PLAYERS
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Player 1</h3>
          <div className="grid grid-cols-2 gap-3">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => selectCharacter(1, char.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedCharacter1 === char.id
                    ? 'border-cyan-400 bg-cyan-400/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: char.color, boxShadow: `0 0 10px ${char.color}` }}
                />
                <span className="text-sm text-white">{char.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-pink-400 mb-4">
            {gameMode === '2player' ? 'Player 2' : 'CPU'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => selectCharacter(2, char.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedCharacter2 === char.id
                    ? 'border-pink-400 bg-pink-400/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: char.color, boxShadow: `0 0 10px ${char.color}` }}
                />
                <span className="text-sm text-white">{char.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setPhase('menu')}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          BACK
        </button>
        <button
          onClick={initializeGame}
          className="px-8 py-3 bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black font-bold rounded-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.6)]"
        >
          FIGHT!
        </button>
      </div>
    </div>
  );
};
