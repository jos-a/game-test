
export interface Character {
  id: string;
  name: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  attackPower: number;
  direction: 'left' | 'right';
  isAttacking: boolean;
  color: string;
  width: number;
  height: number;
  isJumping: boolean;
  attackCooldown: number;
}

export const CHARACTERS = [
  { id: 'warrior', name: '战士', color: '#e94560', attackPower: 15, maxHealth: 100 },
  { id: 'mage', name: '法师', color: '#00d9ff', attackPower: 20, maxHealth: 80 },
  { id: 'ninja', name: '忍者', color: '#00ff88', attackPower: 18, maxHealth: 90 },
  { id: 'knight', name: '骑士', color: '#ffd700', attackPower: 12, maxHealth: 120 },
];

export type GameMode = 'cpu' | '2player';

export type GamePhase = 'menu' | 'characterSelect' | 'game' | 'gameOver';
