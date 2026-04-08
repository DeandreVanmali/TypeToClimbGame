'use client';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import VineDisplay from '@/graphics/VineDisplay';
import { GameInput } from '@/components/GameInput';
import { GameStats } from '@/components/GameStats';
import JungleIcon from '@/graphics/JungleIcon';
import LeaderboardOverlay from '@/components/LeaderboardOverlay';
import { AnimalOption } from '@/data/animals';

const TARGET_HEIGHT = 15;

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510] flex items-center justify-center"><p className="text-xl font-bold text-white">Loading game...</p></div>}>
      <GameContent />
    </Suspense>
  );
}

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const currentWordStartedAtRef = useRef<number>(Date.now());

  // Game state
  const [isConnected, setIsConnected] = useState(false);
  const [word, setWord] = useState('');
  const [height, setHeight] = useState(0);
  const [lastIncrement, setLastIncrement] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [wordDifficulty, setWordDifficulty] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);
  const [matchResult, setMatchResult] = useState<{ winner: string; isWinner: boolean } | null>(null);
  const [showError, setShowError] = useState(false);

  // Get player name and animal from URL params (passed from lobby)
  const playerName = searchParams.get('name') || 'Player';
  const animal: AnimalOption = (searchParams.get('animal') as AnimalOption) || 'monkey';
  const lobbyCode = searchParams.get('lobbyCode') || '';
  const selectedDifficulty = (searchParams.get('difficulty') || 'normal').toLowerCase();

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `http://${window.location.hostname}:5000`;
    const socket = io(backendUrl);
    socketRef.current = socket;
    sessionStartTimeRef.current = Date.now();
    currentWordStartedAtRef.current = Date.now();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_public', { name: playerName, animal });
      if (lobbyCode) {
        socket.emit('join_game_session', { lobbyCode, playerName });
      }
      socket.emit('request_word');
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('word', (data: { text: string; difficulty?: number }) => {
      setWord(data.text);
      setWordDifficulty(data.difficulty ?? 1);
      currentWordStartedAtRef.current = Date.now();
    });

    socket.on('progress', (data: { height: number; lastIncrement: number; accuracy: number; timeMs: number; rounds?: number }) => {
      setHeight(data.height);
      setLastIncrement(data.lastIncrement);
      setAccuracy(data.accuracy);
      const elapsedMs = Date.now() - sessionStartTimeRef.current;
      setTimeMs(elapsedMs);
    });

    socket.on('game_complete', (data: { finalHeight: number; rounds: number }) => {
      setGameComplete(true);
      setFinalHeight(data.finalHeight);
      setRounds(data.rounds);
      setShowLeaderboard(true);
    });

    socket.on('match_finished', (data: { winner: string; finalHeight: number; rounds: number }) => {
      setGameComplete(true);
      setFinalHeight(data.finalHeight);
      setRounds(data.rounds);
      setMatchResult({ winner: data.winner, isWinner: data.winner === playerName });
      setShowLeaderboard(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [animal, lobbyCode, playerName]);

  const handleSubmit = () => {
    if (socketRef.current && input.trim()) {
      const isCorrect = input.toLowerCase() === word.toLowerCase();
      if (!isCorrect) {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
      const elapsedForWord = Date.now() - currentWordStartedAtRef.current;
      socketRef.current.emit('submit', { typed: input, timeMs: elapsedForWord });
      setInput('');
    }
  };

  const handleExitGame = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    router.push('/lobby');
  };

  const handleBackToHome = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510]">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-jungle-green to-jungle-leaf text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl uppercase font-black flex items-center gap-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <JungleIcon className="w-8 h-8" /> Vine Climbing
            </h1>
            <p className="text-sm opacity-90">Player: {playerName}</p>
            <p className="text-xs opacity-80">
              Mode {selectedDifficulty} • Word Difficulty {wordDifficulty} • Target Height {TARGET_HEIGHT}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span 
              className={`text-xs px-2 py-1 rounded-full font-bold ${
                isConnected ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
              }`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <button
              onClick={handleExitGame}
              className="bg-white text-jungle-green font-bold px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              ← Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Vine display */}
        <section className="lg:col-span-2">
          <div className="h-[80vh] rounded-lg shadow-lg overflow-hidden relative">
            <VineDisplay
              height={height}
              animal={animal}
              gameComplete={gameComplete}
            />
          </div>
        </section>

        {/* Input and stats */}
        <section className="flex flex-col gap-4">
          <GameInput
            word={word}
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            disabled={gameComplete}
            showError={showError}
          />
          <GameStats
            height={height}
            lastIncrement={lastIncrement}
            accuracy={accuracy}
            timeMs={timeMs}
          />
        </section>
      </main>

      {/* Leaderboard overlay */}
      <LeaderboardOverlay
        isOpen={showLeaderboard}
        rounds={rounds}
        finalHeight={finalHeight}
        winnerName={matchResult?.winner}
        isWinner={matchResult?.isWinner}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}
