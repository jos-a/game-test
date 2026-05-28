
import { useEffect, useRef, useCallback } from 'react';

interface SoundEffect {
  name: string;
  path: string;
  audio?: HTMLAudioElement;
}

export type SoundName = 
  | 'ok' 
  | 'join' 
  | 'cancel' 
  | 'pass' 
  | 'end' 
  | 'attack' 
  | 'hit' 
  | 'punch' 
  | 'kick' 
  | 'sword' 
  | 'throw';

export const useAudio = () => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmPlayedRef = useRef(false);
  const soundsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    bgmRef.current = new Audio('/audio/bgm/main.m4a');
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;

    const soundFiles: SoundEffect[] = [
      { name: 'ok', path: '/audio/m_ok.m4a' },
      { name: 'join', path: '/audio/m_join.m4a' },
      { name: 'cancel', path: '/audio/m_cancel.m4a' },
      { name: 'pass', path: '/audio/m_pass.m4a' },
      { name: 'end', path: '/audio/m_end.m4a' },
      { name: 'attack', path: '/audio/001.m4a' },
      { name: 'hit', path: '/audio/002.m4a' },
      { name: 'punch', path: '/audio/003.m4a' },
      { name: 'kick', path: '/audio/004.m4a' },
      { name: 'sword', path: '/audio/005.m4a' },
      { name: 'throw', path: '/audio/006.m4a' },
    ];

    soundFiles.forEach(sound => {
      const audio = new Audio(sound.path);
      audio.volume = 0.7;
      soundsRef.current.set(sound.name, audio);
    });

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      soundsRef.current.clear();
    };
  }, []);

  const playBGM = useCallback(() => {
    if (bgmRef.current && !bgmPlayedRef.current) {
      bgmRef.current.play().then(() => {
        bgmPlayedRef.current = true;
      }).catch(err => {
        console.log('BGM autoplay blocked, waiting for user interaction');
      });
    }
  }, []);

  const startBGMOnInteraction = useCallback(() => {
    if (!bgmPlayedRef.current) {
      playBGM();
    }
  }, [playBGM]);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      bgmPlayedRef.current = false;
    }
  }, []);

  const playSound = useCallback((soundName: SoundName) => {
    const audio = soundsRef.current.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Sound play failed:', err);
      });
    }
  }, []);

  const playAttackSound = useCallback(() => {
    playSound('attack');
  }, [playSound]);

  const playHitSound = useCallback(() => {
    playSound('hit');
  }, [playSound]);

  const playPunchSound = useCallback(() => {
    playSound('punch');
  }, [playSound]);

  const playKickSound = useCallback(() => {
    playSound('kick');
  }, [playSound]);

  const playSwordSound = useCallback(() => {
    playSound('sword');
  }, [playSound]);

  const playThrowSound = useCallback(() => {
    playSound('throw');
  }, [playSound]);

  return {
    playBGM,
    stopBGM,
    playSound,
    startBGMOnInteraction,
    playAttackSound,
    playHitSound,
    playPunchSound,
    playKickSound,
    playSwordSound,
    playThrowSound,
  };
};
