
import { Character } from '@/types/game';

interface HealthBarProps {
  character: Character;
  playerNumber: 1 | 2;
}

export const HealthBar: React.FC&lt;HealthBarProps&gt; = ({ character, playerNumber }) =&gt; {
  const healthPercent = (character.health / character.maxHealth) * 100;
  
  return (
    &lt;div className={`flex flex-col ${playerNumber === 2 ? 'items-end' : 'items-start'}`}&gt;
      &lt;span 
        className="text-sm font-bold mb-1"
        style={{ color: character.color }}
      &gt;
        {playerNumber === 1 ? '玩家 1' : (playerNumber === 2 ? '玩家 2' : 'CPU')} - {character.name}
      &lt;/span&gt;
      &lt;div className="w-64 h-6 bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden"&gt;
        &lt;div
          className="h-full transition-all duration-200"
          style={{
            width: `${healthPercent}%`,
            background: healthPercent &gt; 50 
              ? 'linear-gradient(90deg, #00ff88, #00d9ff)' 
              : healthPercent &gt; 25 
                ? 'linear-gradient(90deg, #ffd700, #ff8c00)' 
                : 'linear-gradient(90deg, #ff4444, #e94560)',
            boxShadow: `0 0 10px ${character.color}`,
          }}
        /&gt;
      &lt;/div&gt;
      &lt;span className="text-xs text-gray-400 mt-1"&gt;
        {character.health} / {character.maxHealth}
      &lt;/span&gt;
    &lt;/div&gt;
  );
};
