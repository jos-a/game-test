
import { useGameStore } from './hooks/useGameStore';
import { MenuPage } from './pages/MenuPage';
import { GamePage } from './pages/GamePage';

export default function App() {
  const { phase } = useGameStore();

  if (phase === 'game' || phase === 'gameOver') {
    return <GamePage />;
  }

  return <MenuPage />;
}
