
import { create } from 'zustand';
import { Character, GamePhase, GameMode, CHARACTERS } from '../types/game';

interface GameStore {
  phase: GamePhase;
  gameMode: GameMode;
  selectedCharacters: (string | null)[];
  activePlayers: number[];
  player1: Character | null;
  player2: Character | null;
  winner: 'player1' | 'player2' | null;
  setPhase: (phase: GamePhase) => void;
  setGameMode: (mode: GameMode) => void;
  selectCharacter: (playerSlot: number, characterId: string) => void;
  initializeGame: () => void;
  setWinner: (winner: 'player1' | 'player2') => void;
  resetGame: () => void;
}

const MAX_PLAYERS = 8;

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
    isBlocking: false,
    spritePath: charData.spritePath,
    state: 'standing',
    animationFrame: 0,
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  gameMode: 'cpu',
  selectedCharacters: Array(MAX_PLAYERS).fill(null),
  activePlayers: [0],
  player1: null,
  player2: null,
  winner: null,
  setPhase: (phase) => set({ phase }),
  setGameMode: (mode) => set({ gameMode: mode }),
  selectCharacter: (playerSlot, characterId) => {
    const newSelected = [...get().selectedCharacters];
    newSelected[playerSlot] = characterId;
    set({ selectedCharacters: newSelected });
  },
  initializeGame: () => {
    const { selectedCharacters, activePlayers } = get();
    const p1Char = selectedCharacters[0] || CHARACTERS[0].id;
    const p2Char = selectedCharacters[1] || CHARACTERS[1].id;
    
    set({
      player1: createCharacter(p1Char, 100, 'right'),
      player2: createCharacter(p2Char, 700, 'left'),
      phase: 'game',
      winner: null,
    });
  },
  setWinner: (winner) => set({ winner, phase: 'gameOver' }),
  resetGame: () => {
    const { selectedCharacters } = get();
    const p1Char = selectedCharacters[0] || CHARACTERS[0].id;
    const p2Char = selectedCharacters[1] || CHARACTERS[1].id;
    
    set({
      player1: createCharacter(p1Char, 100, 'right'),
      player2: createCharacter(p2Char, 700, 'left'),
      phase: 'game',
      winner: null,
    });
  },
}));
