
import { create } from 'zustand';
import { Character, GamePhase, GameMode, CHARACTERS } from '../types/game';

interface GameStore {
  phase: GamePhase;
  gameMode: GameMode;
  player1: Character | null;
  player2: Character | null;
  selectedCharacter1: string | null;
  selectedCharacter2: string | null;
  winner: 'player1' | 'player2' | null;
  setPhase: (phase: GamePhase) => void;
  setGameMode: (mode: GameMode) => void;
  selectCharacter: (player: 1 | 2, characterId: string) => void;
  initializeGame: () => void;
  setWinner: (winner: 'player1' | 'player2') => void;
  resetGame: () => void;
}

const createCharacter = (characterId: string, x: number, direction: 'left' | 'right'): Character => {
  const charData = CHARACTERS.find(c => c.id === characterId)!;
  return {
    id: charData.id,
    name: charData.name,
    x,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    health: charData.maxHealth,
    maxHealth: charData.maxHealth,
    attackPower: charData.attackPower,
    direction,
    isAttacking: false,
    color: charData.color,
    width: 50,
    height: 80,
    isJumping: false,
    attackCooldown: 0,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  gameMode: 'cpu',
  player1: null,
  player2: null,
  selectedCharacter1: null,
  selectedCharacter2: null,
  winner: null,
  setPhase: (phase) => set({ phase }),
  setGameMode: (mode) => set({ gameMode: mode }),
  selectCharacter: (player, characterId) => {
    if (player === 1) {
      set({ selectedCharacter1: characterId });
    } else {
      set({ selectedCharacter2: characterId });
    }
  },
  initializeGame: () => {
    const { selectedCharacter1, selectedCharacter2, gameMode } = get();
    const p1Char = selectedCharacter1 || CHARACTERS[0].id;
    const p2Char = selectedCharacter2 || CHARACTERS[1].id;
    
    set({
      player1: createCharacter(p1Char, 100, 'right'),
      player2: createCharacter(p2Char, 700, 'left'),
      phase: 'game',
      winner: null,
    });
  },
  setWinner: (winner) => set({ winner, phase: 'gameOver' }),
  resetGame: () => {
    const { selectedCharacter1, selectedCharacter2 } = get();
    const p1Char = selectedCharacter1 || CHARACTERS[0].id;
    const p2Char = selectedCharacter2 || CHARACTERS[1].id;
    
    set({
      player1: createCharacter(p1Char, 100, 'right'),
      player2: createCharacter(p2Char, 700, 'left'),
      phase: 'game',
      winner: null,
    });
  },
}));
