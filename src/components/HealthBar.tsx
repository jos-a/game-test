
import { Character } from '../types/game';

interface HealthBarProps {
  character: Character;
  playerNumber: 1 | 2;
}

export const HealthBar: React.FC<HealthBarProps> = ({ character, playerNumber }) => {
  const healthPercent = (character.health / character.maxHealth) * 100;
  
  return (
    <div className={`flex flex-col ${playerNumber === 2 ? 'items-end' : 'items-start'}`}>
      <span className="text-sm font-bold mb-1" style={{ color: character.color }}>
        Player {playerNumber} - {character.name}
      </span>
      <div className="w-64 h-6 bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden">
        <div
          className="h-full transition-all duration-200"
          style={{
            width: `${healthPercent}%`,
            background: healthPercent > 50 
              ? 'linear-gradient(90deg, #00ff88, #00d9ff)' 
              : healthPercent > 25 
                ? 'linear-gradient(90deg, #ffd700, #ff8c00)' 
                : 'linear-gradient(90deg, #ff4444, #e94560)',
            boxShadow: `0 0 10px ${character.color}`,
          }}
        />
      </div>
      <span className="text-xs text-gray-400 mt-1">
        {character.health} / {character.maxHealth}
      </span>
    </div>
  );
};
