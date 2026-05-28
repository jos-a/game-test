import { useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { CHARACTERS } from '../types/game';

const MAX_PLAYERS = 8;

export const MenuPage: React.FC = () => {
  const {
    phase,
    setPhase,
    selectCharacter,
    selectedCharacters,
    initializeGame
  } = useGameStore();

  const { playSound, startBGMOnInteraction } = useAudio();

  const [playerSelectingIndex, setPlayerSelectingIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>(Array(MAX_PLAYERS).fill(0));
  const [joinedPlayers, setJoinedPlayers] = useState<number[]>([]);
  const [spriteImages, setSpriteImages] = useState<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    startBGMOnInteraction();
  }, [startBGMOnInteraction]);

  useEffect(() => {
    const sprites = new Map<string, HTMLImageElement>();
    CHARACTERS.forEach(char => {
      const img = new Image();
      img.src = char.spritePath;
      sprites.set(char.id, img);
    });
    setSpriteImages(sprites);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'menu') {
        if (e.key.toLowerCase() === 'f' || e.key.toLowerCase() === 'j') {
          playSound('ok');
          setPhase('characterSelect');
        }
      } else if (phase === 'characterSelect') {
        const key = e.key.toLowerCase();

        if (playerSelectingIndex === null) {
          if (key === 'f') {
            if (!joinedPlayers.includes(0)) {
              playSound('join');
              setPlayerSelectingIndex(0);
              setJoinedPlayers([...joinedPlayers, 0]);
            }
          } else if (key === 'j') {
            if (!joinedPlayers.includes(1) && joinedPlayers.length < MAX_PLAYERS) {
              playSound('join');
              setPlayerSelectingIndex(1);
              setJoinedPlayers([...joinedPlayers, 1]);
            }
          } else if (key === 'enter') {
            if (joinedPlayers.length >= 2) {
              playSound('ok');
              initializeGame();
            }
          } else if (key === 'g' || e.key === 'Escape') {
            playSound('cancel');
            setPhase('menu');
          }
        } else {
          if (key === 'a' || key === 'arrowleft') {
            setSelectedIndices(prev => {
              const newIndices = [...prev];
              newIndices[playerSelectingIndex] = (newIndices[playerSelectingIndex] - 1 + CHARACTERS.length) % CHARACTERS.length;
              return newIndices;
            });
          } else if (key === 'd' || key === 'arrowright') {
            setSelectedIndices(prev => {
              const newIndices = [...prev];
              newIndices[playerSelectingIndex] = (newIndices[playerSelectingIndex] + 1) % CHARACTERS.length;
              return newIndices;
            });
          } else if (key === 'f' || key === 'j') {
            if (playerSelectingIndex === 0 && key === 'f') {
              playSound('ok');
              selectCharacter(playerSelectingIndex, CHARACTERS[selectedIndices[playerSelectingIndex]].id);
              setPlayerSelectingIndex(null);
            } else if (playerSelectingIndex === 1 && key === 'j') {
              playSound('ok');
              selectCharacter(playerSelectingIndex, CHARACTERS[selectedIndices[playerSelectingIndex]].id);
              setPlayerSelectingIndex(null);
            }
          } else if (key === 'g' || key === 'k' || e.key === 'Escape') {
            playSound('cancel');
            setPlayerSelectingIndex(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, playerSelectingIndex, selectedIndices, setPhase, selectCharacter, joinedPlayers, initializeGame, playSound]);

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
            onClick={() => {
              playSound('ok');
              setPhase('characterSelect');
            }}
            className="px-8 py-4 text-xl font-bold bg-gradient-to-r from-[#e94560] to-[#ff6b8a] text-white rounded-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.6)]"
          >
            START GAME
          </button>
        </div>

        <div className="mt-12 text-gray-400 text-sm text-center max-w-md">
          <p className="mb-2">Player 1: W/A/D to move, F to attack, G to block</p>
          <p>Player 2: Arrow keys to move, J to attack, K to block</p>
          <p className="mt-4 text-yellow-400">Press F or J to start!</p>
        </div>
      </div>
    );
  }

  const getPlayerColor = (index: number) => {
    const colors = ['#00d9ff', '#e94560', '#00ff88', '#ffd700', '#ff69b4', '#9370db', '#20b2aa', '#ff6347'];
    return colors[index % colors.length];
  };

  const drawCharacterPreview = (ctx: CanvasRenderingContext2D, charId: string, x: number, y: number, size: number) => {
    const img = spriteImages.get(charId);
    if (!img || !img.complete) {
      const char = CHARACTERS.find(c => c.id === charId);
      ctx.fillStyle = char?.color || '#666';
      ctx.fillRect(x, y, size, size);
      return;
    }

    const SPRITE_WIDTH = 79;
    const SPRITE_HEIGHT = 79;
    const SPRITE_COLS = 7;
    const frameIndex = 0;
    const frameX = (frameIndex % SPRITE_COLS) * SPRITE_WIDTH;
    const frameY = Math.floor(frameIndex / SPRITE_COLS) * SPRITE_HEIGHT;

    ctx.drawImage(
      img,
      frameX, frameY, SPRITE_WIDTH, SPRITE_HEIGHT,
      x, y, size, size
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] p-8">
      <h2 className="text-3xl font-bold mb-8 text-cyan-400" style={{ textShadow: '0 0 10px #00d9ff' }}>
        SELECT CHARACTER
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-8 max-w-5xl">
        {Array.from({ length: MAX_PLAYERS }).map((_, i) => {
          const selectedCharIndex = selectedIndices[i];
          const selectedChar = CHARACTERS[selectedCharIndex];
          const isSelected = playerSelectingIndex === i;
          const hasJoined = joinedPlayers.includes(i);
          const hasCharacter = selectedCharacters[i] !== null;

          return (
            <div
              key={i}
              className={`relative bg-gray-900/80 rounded-lg p-6 transition-all ${
                isSelected ? 'scale-105' : ''
              }`}
              style={{
                border: `4px solid ${getPlayerColor(i)}`,
                boxShadow: isSelected
                  ? `0 0 30px ${getPlayerColor(i)}`
                  : `0 0 10px ${getPlayerColor(i)}`,
                opacity: hasJoined ? 1 : 0.4,
              }}
            >
              <div className="text-center mb-4">
                <canvas
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.clearRect(0, 0, 96, 96);
                        if (hasCharacter) {
                          drawCharacterPreview(ctx, selectedChar.id, 0, 0, 96);
                        } else {
                          ctx.fillStyle = '#1a1a2e';
                          ctx.fillRect(0, 0, 96, 96);
                          ctx.fillStyle = '#666';
                          ctx.font = '48px Arial';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText('?', 48, 48);
                        }
                      }
                    }
                  }}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-lg mx-auto mb-3"
                  style={{
                    boxShadow: hasCharacter
                      ? `0 0 30px ${selectedChar.color}`
                      : 'inset 0 0 20px rgba(0,0,0,0.5)',
                    animation: isSelected ? 'pulse 1s infinite' : 'none'
                  }}
                />
              </div>

              <div className="text-center space-y-2">
                <div className="text-xl font-bold" style={{ color: getPlayerColor(i) }}>
                  {i === 0 ? 'Player 1' : i === 1 ? 'Player 2' : `Player ${i + 1}`}
                </div>

                <div className="text-base font-semibold text-white">
                  {hasCharacter ? selectedChar.name : 'No Character'}
                </div>

                {!hasJoined && (
                  <div className="text-xs text-gray-500 italic">
                    Press {i === 0 ? 'F' : i === 1 ? 'J' : `P${i + 1}`} to join
                  </div>
                )}

                {isSelected && (
                  <div className="text-sm text-green-400 mt-3 space-y-1">
                    <div>A/D ← → to select</div>
                    <div>{i === 0 ? 'F' : 'J'} to confirm</div>
                    <div>G to cancel</div>
                  </div>
                )}

                {hasJoined && !hasCharacter && !isSelected && (
                  <div className="text-xs text-yellow-400 italic">
                    Choosing...
                  </div>
                )}

                {hasCharacter && !isSelected && (
                  <div className="text-xs text-green-400 font-bold">
                    READY!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            playSound('cancel');
            setPhase('menu');
          }}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
        >
          BACK
        </button>
        <button
          onClick={() => {
            playSound('ok');
            initializeGame();
          }}
          disabled={joinedPlayers.length < 2}
          className={`px-8 py-3 font-bold rounded-lg transition-all duration-300 ${
            joinedPlayers.length >= 2
              ? 'bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black hover:scale-110 shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.6)]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          FIGHT! ({joinedPlayers.length} joined)
        </button>
      </div>

      <div className="mt-8 text-gray-400 text-sm text-center space-y-1">
        <p>F: Join Player 1 | J: Join Player 2</p>
        <p>A/D or ← →: Switch characters | G/ESC: Cancel</p>
        <p className="text-yellow-400 mt-2">Press Enter to start fight!</p>
      </div>
    </div>
  );
};
