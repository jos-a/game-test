
import { useEffect, useRef } from 'react';
import { Character } from '../types/game';
import { useAudio } from '../hooks/useAudio';

interface GameEngineProps {
  player1: Character;
  player2: Character;
  gameMode: 'cpu' | '2player';
  onUpdatePlayers: (p1: Character, p2: Character) => void;
  onGameOver: (winner: 'player1' | 'player2') => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const GROUND_Y = 400;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;
const BLOCK_DAMAGE_REDUCTION = 0.2;

const SPRITE_WIDTH = 79;
const SPRITE_HEIGHT = 79;
const SPRITE_COLS = 7;

export const GameEngine: React.FC<GameEngineProps> = ({
  player1,
  player2,
  gameMode,
  onUpdatePlayers,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const gameLoopRef = useRef<number>();
  const p1Ref = useRef(player1);
  const p2Ref = useRef(player2);
  const lastAttackSoundRef = useRef<number>(0);
  const lastHitSoundRef = useRef<number>(0);
  const spriteImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const animationFrameRef = useRef<number>(0);
  
  const { playAttackSound, playHitSound, startBGMOnInteraction } = useAudio();

  useEffect(() => {
    p1Ref.current = player1;
    p2Ref.current = player2;
  }, [player1, player2]);

  useEffect(() => {
    startBGMOnInteraction();
  }, [startBGMOnInteraction]);

  useEffect(() => {
    const spritePaths = [
      '/sprite/sys/davis_0.png',
      '/sprite/sys/woody_0.png',
      '/sprite/sys/dennis_0.png',
      '/sprite/sys/freeze_0.png',
      '/sprite/sys/firen_0.png',
      '/sprite/sys/louis_0.png',
      '/sprite/sys/rudolf_0.png',
      '/sprite/sys/henry_0.png',
      '/sprite/sys/john_0.png',
      '/sprite/sys/deep_0.png',
      '/sprite/sys/bandit_0.png',
      '/sprite/sys/hunter_0.png',
      '/sprite/sys/mark_0.png',
      '/sprite/sys/jack_0.png',
      '/sprite/sys/sorcerer_0.png',
      '/sprite/sys/monk_0.png',
      '/sprite/sys/jan_0.png',
      '/sprite/sys/knight_0.png',
      '/sprite/sys/justin_0.png',
      '/sprite/sys/bat_0.png',
      '/sprite/sys/firzen_0.png',
      '/sprite/sys/louisEX_0.png',
      '/sprite/sys/julian_0.png',
    ];

    spritePaths.forEach(path => {
      const img = new Image();
      img.src = path;
      spriteImagesRef.current.set(path, img);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateCharacter = (
    char: Character,
    keys: { left: string; right: string; jump: string; attack: string; block: string },
    isCPU = false,
    opponent?: Character
  ): Character => {
    const newChar = { ...char };
    animationFrameRef.current++;

    if (newChar.attackCooldown > 0) {
      newChar.attackCooldown--;
    }

    if (isCPU && opponent) {
      const dist = opponent.x - newChar.x;
      if (Math.abs(dist) > 100) {
        if (dist > 0) {
          newChar.velocityX = MOVE_SPEED * 0.7;
          newChar.direction = 'right';
          newChar.state = 'running';
        } else {
          newChar.velocityX = -MOVE_SPEED * 0.7;
          newChar.direction = 'left';
          newChar.state = 'running';
        }
      } else {
        newChar.velocityX = 0;
        newChar.state = 'standing';
        if (newChar.attackCooldown === 0 && Math.random() < 0.02) {
          newChar.isAttacking = true;
          newChar.attackCooldown = 30;
          newChar.state = 'attacking';
        }
      }
      if (!newChar.isJumping && Math.random() < 0.01) {
        newChar.velocityY = JUMP_FORCE;
        newChar.isJumping = true;
        newChar.state = 'jumping';
      }
      newChar.isBlocking = false;
    } else {
      newChar.isBlocking = !!keysRef.current[keys.block];
      
      if (newChar.isBlocking) {
        newChar.state = 'blocking';
        newChar.velocityX = 0;
      } else {
        if (keysRef.current[keys.left]) {
          newChar.velocityX = -MOVE_SPEED;
          newChar.direction = 'left';
          newChar.state = 'walking';
        } else if (keysRef.current[keys.right]) {
          newChar.velocityX = MOVE_SPEED;
          newChar.direction = 'right';
          newChar.state = 'walking';
        } else {
          newChar.velocityX = 0;
          newChar.state = 'standing';
        }

        if (keysRef.current[keys.jump] && !newChar.isJumping) {
          newChar.velocityY = JUMP_FORCE;
          newChar.isJumping = true;
          newChar.state = 'jumping';
        }

        if (keysRef.current[keys.attack] && newChar.attackCooldown === 0) {
          newChar.isAttacking = true;
          newChar.attackCooldown = 20;
          newChar.state = 'attacking';
          if (Date.now() - lastAttackSoundRef.current > 300) {
            playAttackSound();
            lastAttackSoundRef.current = Date.now();
          }
        }
      }
    }

    newChar.velocityY += GRAVITY;
    newChar.x += newChar.velocityX;
    newChar.y += newChar.velocityY;

    if (newChar.x < 0) newChar.x = 0;
    if (newChar.x + newChar.width > CANVAS_WIDTH) newChar.x = CANVAS_WIDTH - newChar.width;

    if (newChar.y >= GROUND_Y - newChar.height) {
      newChar.y = GROUND_Y - newChar.height;
      newChar.velocityY = 0;
      newChar.isJumping = false;
      if (newChar.state === 'jumping') {
        newChar.state = 'standing';
      }
    }

    if (newChar.attackCooldown < 15) {
      newChar.isAttacking = false;
      if (!newChar.isBlocking && newChar.velocityX === 0) {
        newChar.state = 'standing';
      }
    }

    const frameCount = Math.floor(animationFrameRef.current / 10) % 10;
    newChar.animationFrame = frameCount;

    return newChar;
  };

  const handleAttack = (attacker: Character, defender: Character): Character => {
    if (!attacker.isAttacking) return defender;

    const attackBox = {
      x: attacker.direction === 'right' ? attacker.x + attacker.width : attacker.x - 40,
      y: attacker.y + 20,
      width: 40,
      height: 40,
    };

    const hit = (
      attackBox.x < defender.x + defender.width &&
      attackBox.x + attackBox.width > defender.x &&
      attackBox.y < defender.y + defender.height &&
      attackBox.y + attackBox.height > defender.y
    );

    if (hit && attacker.attackCooldown === 18) {
      let damage = attacker.attackPower;
      if (defender.isBlocking) {
        damage = Math.floor(damage * BLOCK_DAMAGE_REDUCTION);
        defender.state = 'blocking';
      } else {
        defender.state = 'hit';
      }
      if (Date.now() - lastHitSoundRef.current > 200) {
        playHitSound();
        lastHitSoundRef.current = Date.now();
      }
      return { ...defender, health: Math.max(0, defender.health - damage) };
    }
    return defender;
  };

  const drawCharacter = (ctx: CanvasRenderingContext2D, char: Character) => {
    const sprite = spriteImagesRef.current.get(char.spritePath);
    
    if (!sprite || !sprite.complete) {
      ctx.fillStyle = char.color;
      ctx.shadowColor = char.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(char.x, char.y, char.width, char.height);
      return;
    }

    const stateFrames: Record<string, number[]> = {
      standing: [0, 1, 2, 3],
      walking: [4, 5, 6, 7],
      running: [20, 21, 22],
      jumping: [10, 11, 12],
      attacking: [30, 31, 32, 33],
      blocking: [50, 51, 52],
      hit: [40, 41],
      defending: [50, 51, 52],
    };

    const frames = stateFrames[char.state] || stateFrames.standing;
    const frameIndex = frames[char.animationFrame % frames.length];
    const frameX = (frameIndex % SPRITE_COLS) * SPRITE_WIDTH;
    const frameY = Math.floor(frameIndex / SPRITE_COLS) * SPRITE_HEIGHT;

    ctx.save();
    
    if (char.direction === 'left') {
      ctx.translate(char.x + char.width, char.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(char.x, char.y);
    }

    if (char.isBlocking) {
      ctx.fillStyle = 'rgba(0, 191, 255, 0.3)';
      ctx.shadowColor = '#00bfff';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(25, 40, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.drawImage(
      sprite,
      frameX, frameY, SPRITE_WIDTH, SPRITE_HEIGHT,
      0, 0, char.width, char.height
    );

    ctx.restore();
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let newP1 = updateCharacter(p1Ref.current, {
      left: 'a',
      right: 'd',
      jump: 'w',
      attack: 'f',
      block: 'g',
    });
    let newP2 = updateCharacter(
      p2Ref.current,
      { left: 'arrowleft', right: 'arrowright', jump: 'arrowup', attack: 'j', block: 'k' },
      gameMode === 'cpu',
      newP1
    );

    newP2 = handleAttack(newP1, newP2);
    newP1 = handleAttack(newP2, newP1);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const gradient = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
    ctx.stroke();

    drawCharacter(ctx, newP1);
    drawCharacter(ctx, newP2);

    p1Ref.current = newP1;
    p2Ref.current = newP2;
    onUpdatePlayers(newP1, newP2);

    if (newP1.health <= 0) {
      onGameOver('player2');
      return;
    }
    if (newP2.health <= 0) {
      onGameOver('player1');
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-cyan-400 rounded-lg shadow-2xl"
      style={{ boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)' }}
    />
  );
};
