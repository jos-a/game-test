
import { useEffect, useRef, useState } from 'react';
import { Character } from '@/types/game';
import { useGameStore } from '@/hooks/useGameStore';

interface GameEngineProps {
  player1: Character;
  player2: Character;
  gameMode: 'cpu' | '2player';
  onUpdatePlayers: (p1: Character, p2: Character) =&gt; void;
  onGameOver: (winner: 'player1' | 'player2') =&gt; void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const GROUND_Y = 400;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;

export const GameEngine: React.FC&lt;GameEngineProps&gt; = ({
  player1,
  player2,
  gameMode,
  onUpdatePlayers,
  onGameOver,
}) =&gt; {
  const canvasRef = useRef&lt;HTMLCanvasElement&gt;(null);
  const keysRef = useRef&lt;Record&lt;string, boolean&gt;&gt;({});
  const gameLoopRef = useRef&lt;number&gt;();
  const p1Ref = useRef(player1);
  const p2Ref = useRef(player2);

  useEffect(() =&gt; {
    p1Ref.current = player1;
    p2Ref.current = player2;
  }, [player1, player2]);

  useEffect(() =&gt; {
    const handleKeyDown = (e: KeyboardEvent) =&gt; {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) =&gt; {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () =&gt; {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const checkCollision = (a: Character, b: Character): boolean =&gt; {
    return (
      a.x &lt; b.x + b.width &amp;&amp;
      a.x + a.width &gt; b.x &amp;&amp;
      a.y &lt; b.y + b.height &amp;&amp;
      a.y + a.height &gt; b.y
    );
  };

  const updateCharacter = (
    char: Character,
    keys: { left: string; right: string; jump: string; attack: string },
    isCPU = false,
    opponent?: Character
  ): Character =&gt; {
    const newChar = { ...char };

    if (newChar.attackCooldown &gt; 0) {
      newChar.attackCooldown--;
    }

    if (isCPU &amp;&amp; opponent) {
      const dist = opponent.x - newChar.x;
      if (Math.abs(dist) &gt; 100) {
        if (dist &gt; 0) {
          newChar.velocityX = MOVE_SPEED * 0.7;
          newChar.direction = 'right';
        } else {
          newChar.velocityX = -MOVE_SPEED * 0.7;
          newChar.direction = 'left';
        }
      } else {
        newChar.velocityX = 0;
        if (newChar.attackCooldown === 0 &amp;&amp; Math.random() &lt; 0.02) {
          newChar.isAttacking = true;
          newChar.attackCooldown = 30;
        }
      }
      if (!newChar.isJumping &amp;&amp; Math.random() &lt; 0.01) {
        newChar.velocityY = JUMP_FORCE;
        newChar.isJumping = true;
      }
    } else {
      if (keysRef.current[keys.left]) {
        newChar.velocityX = -MOVE_SPEED;
        newChar.direction = 'left';
      } else if (keysRef.current[keys.right]) {
        newChar.velocityX = MOVE_SPEED;
        newChar.direction = 'right';
      } else {
        newChar.velocityX = 0;
      }

      if (keysRef.current[keys.jump] &amp;&amp; !newChar.isJumping) {
        newChar.velocityY = JUMP_FORCE;
        newChar.isJumping = true;
      }

      if (keysRef.current[keys.attack] &amp;&amp; newChar.attackCooldown === 0) {
        newChar.isAttacking = true;
        newChar.attackCooldown = 20;
      }
    }

    newChar.velocityY += GRAVITY;
    newChar.x += newChar.velocityX;
    newChar.y += newChar.velocityY;

    if (newChar.x &lt; 0) newChar.x = 0;
    if (newChar.x + newChar.width &gt; CANVAS_WIDTH) newChar.x = CANVAS_WIDTH - newChar.width;

    if (newChar.y &gt;= GROUND_Y - newChar.height) {
      newChar.y = GROUND_Y - newChar.height;
      newChar.velocityY = 0;
      newChar.isJumping = false;
    }

    if (newChar.attackCooldown &lt; 15) {
      newChar.isAttacking = false;
    }

    return newChar;
  };

  const handleAttack = (attacker: Character, defender: Character): Character =&gt; {
    if (!attacker.isAttacking) return defender;

    const attackBox = {
      x: attacker.direction === 'right' ? attacker.x + attacker.width : attacker.x - 40,
      y: attacker.y + 20,
      width: 40,
      height: 40,
    };

    const hit = (
      attackBox.x &lt; defender.x + defender.width &amp;&amp;
      attackBox.x + attackBox.width &gt; defender.x &amp;&amp;
      attackBox.y &lt; defender.y + defender.height &amp;&amp;
      attackBox.y + attackBox.height &gt; defender.y
    );

    if (hit &amp;&amp; attacker.attackCooldown === 18) {
      return { ...defender, health: Math.max(0, defender.health - attacker.attackPower) };
    }
    return defender;
  };

  const drawCharacter = (ctx: CanvasRenderingContext2D, char: Character) =&gt; {
    ctx.save();
    
    if (char.direction === 'left') {
      ctx.translate(char.x + char.width, char.y);
      ctx.scale(-1, 1);
      ctx.translate(0, 0);
    } else {
      ctx.translate(char.x, char.y);
    }

    ctx.fillStyle = char.color;
    ctx.shadowColor = char.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(10, 20, 30, 40);

    ctx.beginPath();
    ctx.arc(25, 15, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 60, 10, 20);
    ctx.fillRect(25, 60, 10, 20);

    if (char.isAttacking) {
      ctx.fillStyle = '#ffff00';
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 20;
      ctx.fillRect(40, 25, 30, 15);
    }

    ctx.restore();
  };

  const gameLoop = () =&gt; {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let newP1 = updateCharacter(p1Ref.current, {
      left: 'a',
      right: 'd',
      jump: 'w',
      attack: 'f',
    });
    let newP2 = updateCharacter(
      p2Ref.current,
      { left: 'arrowleft', right: 'arrowright', jump: 'arrowup', attack: 'j' },
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

    if (newP1.health &lt;= 0) {
      onGameOver('player2');
      return;
    }
    if (newP2.health &lt;= 0) {
      onGameOver('player1');
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() =&gt; {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () =&gt; {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    &lt;canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-cyan-400 rounded-lg shadow-2xl"
      style={{ boxShadow: '0 0 30px rgba(0, 217, 255, 0.5)' }}
    /&gt;
  );
};
