export type GamePhase = 'menu' | 'characterSelect' | 'game' | 'gameOver';
export type GameMode = 'cpu' | '2player';
export type CharacterState = 'standing' | 'walking' | 'running' | 'jumping' | 'attacking' | 'blocking' | 'hit' | 'defending';

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
  isBlocking: boolean;
  spritePath: string;
  state: CharacterState;
  animationFrame: number;
}

export const CHARACTERS = [
  { id: 'davis', name: 'Davis', color: '#4169e1', attackPower: 15, maxHealth: 100, spritePath: '/sprite/sys/davis_0.png' },
  { id: 'woody', name: 'Woody', color: '#00ff00', attackPower: 14, maxHealth: 100, spritePath: '/sprite/sys/woody_0.png' },
  { id: 'dennis', name: 'Dennis', color: '#ff69b4', attackPower: 16, maxHealth: 95, spritePath: '/sprite/sys/dennis_0.png' },
  { id: 'freeze', name: 'Freeze', color: '#00bfff', attackPower: 17, maxHealth: 90, spritePath: '/sprite/sys/freeze_0.png' },
  { id: 'firen', name: 'Firen', color: '#ff4500', attackPower: 18, maxHealth: 85, spritePath: '/sprite/sys/firen_0.png' },
  { id: 'louis', name: 'Louis', color: '#800080', attackPower: 13, maxHealth: 110, spritePath: '/sprite/sys/louis_0.png' },
  { id: 'rudolf', name: 'Rudolf', color: '#8b4513', attackPower: 17, maxHealth: 88, spritePath: '/sprite/sys/rudolf_0.png' },
  { id: 'henry', name: 'Henry', color: '#90ee90', attackPower: 14, maxHealth: 95, spritePath: '/sprite/sys/henry_0.png' },
  { id: 'john', name: 'John', color: '#00ced1', attackPower: 12, maxHealth: 120, spritePath: '/sprite/sys/john_0.png' },
  { id: 'deep', name: 'Deep', color: '#dc143c', attackPower: 16, maxHealth: 100, spritePath: '/sprite/sys/deep_0.png' },
  { id: 'bandit', name: 'Bandit', color: '#2f4f4f', attackPower: 10, maxHealth: 80, spritePath: '/sprite/sys/bandit_0.png' },
  { id: 'hunter', name: 'Hunter', color: '#556b2f', attackPower: 12, maxHealth: 85, spritePath: '/sprite/sys/hunter_0.png' },
  { id: 'mark', name: 'Mark', color: '#cd853f', attackPower: 13, maxHealth: 115, spritePath: '/sprite/sys/mark_0.png' },
  { id: 'jack', name: 'Jack', color: '#daa520', attackPower: 15, maxHealth: 90, spritePath: '/sprite/sys/jack_0.png' },
  { id: 'sorcerer', name: 'Sorcerer', color: '#9932cc', attackPower: 20, maxHealth: 75, spritePath: '/sprite/sys/sorcerer_0.png' },
  { id: 'monk', name: 'Monk', color: '#ffdab9', attackPower: 11, maxHealth: 110, spritePath: '/sprite/sys/monk_0.png' },
  { id: 'jan', name: 'Jan', color: '#ff6347', attackPower: 14, maxHealth: 95, spritePath: '/sprite/sys/jan_0.png' },
  { id: 'knight', name: 'Knight', color: '#4682b4', attackPower: 12, maxHealth: 125, spritePath: '/sprite/sys/knight_0.png' },
  { id: 'justin', name: 'Justin', color: '#696969', attackPower: 15, maxHealth: 100, spritePath: '/sprite/sys/justin_0.png' },
  { id: 'bat', name: 'Bat', color: '#000000', attackPower: 18, maxHealth: 80, spritePath: '/sprite/sys/bat_0.png' },
  { id: 'firzen', name: 'Firzen', color: '#ff1493', attackPower: 22, maxHealth: 95, spritePath: '/sprite/sys/firzen_0.png' },
  { id: 'louisEX', name: 'LouisEX', color: '#ff8c00', attackPower: 19, maxHealth: 110, spritePath: '/sprite/sys/louisEX_0.png' },
  { id: 'julian', name: 'Julian', color: '#800000', attackPower: 25, maxHealth: 120, spritePath: '/sprite/sys/julian_0.png' },
];
