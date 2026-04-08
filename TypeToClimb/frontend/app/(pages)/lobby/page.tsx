'use client';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import JungleIcon from '@/graphics/JungleIcon';
import io, { Socket } from 'socket.io-client';

type DifficultyMode = 'easy' | 'normal' | 'hard';

const DIFFICULTY_LABELS: Record<DifficultyMode, string> = {
  easy: 'Easy (All Ages)',
  normal: 'Normal',
  hard: 'Hard',
};

function normalizeDifficulty(value?: string): DifficultyMode {
  return value === 'easy' || value === 'hard' ? value : 'normal';
}

interface LobbyPlayer {
  id: number;
  name: string;
  animal: string;
  isReady: boolean;
}

interface LobbyPayload {
  lobbyCode: string;
  players: LobbyPlayer[];
  hostName?: string;
  maxPlayers?: number;
  difficulty?: DifficultyMode;
}

interface LobbyUpdatePayload {
  players: LobbyPlayer[];
  hostName?: string;
  maxPlayers?: number;
  difficulty?: DifficultyMode;
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510] flex items-center justify-center"><p className="text-xl font-bold text-white">Loading lobby...</p></div>}>
      <LobbyContent />
    </Suspense>
  );
}

function LobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [difficulty, setDifficulty] = useState<DifficultyMode>('normal');

  // Get player info from URL params (should be passed from login page)
  const playerName = searchParams.get('name') || 'Player';
  const playerAnimal = searchParams.get('animal') || 'monkey';

  // Connect to backend and auto-join lobby
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `http://${window.location.hostname}:5000`;
    console.log('[Lobby] Connecting to backend:', backendUrl);
    
    const newSocket = io(backendUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['polling','websocket'],
      withCredentials: false,
    });

    let hasJoined = false;

    newSocket.on('connect', () => {
      console.log('[Lobby] Socket connected, ID:', newSocket.id);
    });

    newSocket.on('connection_confirmed', (data: { sid: string }) => {
      console.log('[Lobby] Server confirmed connection:', data);
      console.log('[Lobby] Current playerName from URL:', playerName);
      console.log('[Lobby] Current playerAnimal from URL:', playerAnimal);
      // Only auto-join if we haven't already
      if (!hasJoined) {
        hasJoined = true;
        const joinData = {
          playerName,
          animal: playerAnimal
        };
        console.log('[Lobby] Emitting auto_join_lobby with data:', joinData);
        newSocket.emit('auto_join_lobby', joinData);
      }
    });

    newSocket.on('lobby_joined', (data: LobbyPayload) => {
      console.log('[Lobby] Joined lobby:', data);
      console.log('[Lobby] Players received:', data.players);
      setLobbyCode(data.lobbyCode);
      setPlayers(data.players);
      setHostName(data.hostName || '');
      setMaxPlayers(data.maxPlayers || 5);
      setDifficulty(normalizeDifficulty(data.difficulty));
    });

    newSocket.on('lobby_update', (data: LobbyUpdatePayload) => {
      console.log('[Lobby] Lobby updated, players:', data.players);
      setPlayers(data.players);
      setHostName(data.hostName || '');
      setMaxPlayers(data.maxPlayers || 5);
      setDifficulty(normalizeDifficulty(data.difficulty));
    });

    newSocket.on('countdown_update', (data: { remaining: number }) => {
      console.log('[Lobby] Countdown:', data.remaining);
      setCountdown(data.remaining);
    });

    newSocket.on('game_start', (data: { lobbyCode?: string; difficulty?: DifficultyMode }) => {
      console.log('[Lobby] Game starting - navigating to game page!', data);
      const lobbyParam = data?.lobbyCode ? `&lobbyCode=${encodeURIComponent(data.lobbyCode)}` : '';
      const difficultyParam = data?.difficulty ? `&difficulty=${encodeURIComponent(data.difficulty)}` : '';
      router.push(`/game?name=${encodeURIComponent(playerName)}&animal=${encodeURIComponent(playerAnimal)}${lobbyParam}${difficultyParam}`);
    });

    newSocket.on('lobby_error', (data: { message: string }) => {
      console.error('[Lobby] Error:', data.message);
      alert(data.message);
      if (!lobbyCode) {
        router.push('/');
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [playerName, playerAnimal, router]);

  const handleLeave = () => {
    if (socket) {
      socket.close();
    }
    router.push('/');
  };

  const handleStartGame = () => {
    if (socket && lobbyCode) {
      socket.emit('start_game', { lobbyCode });
    }
  };

  const isHost = hostName === playerName;
  const canStart = isHost && players.length >= 2 && countdown === null;
  const difficultyLocked = countdown !== null;

  const handleDifficultyChange = (nextDifficulty: DifficultyMode) => {
    if (!socket || !lobbyCode || !isHost || difficultyLocked) return;
    setDifficulty(nextDifficulty);
    socket.emit('set_lobby_difficulty', { lobbyCode, difficulty: nextDifficulty });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/95 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <JungleIcon className="w-12 h-12" />
            <h1 className="text-3xl font-black text-jungle-green">Lobby</h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-600 flex-wrap">
            {lobbyCode && (
              <>
                <p className="font-mono font-bold text-jungle-green">{lobbyCode}</p>
                <span className="text-gray-400">•</span>
              </>
            )}
              <p>{DIFFICULTY_LABELS[difficulty]}</p>
              <span className="text-gray-400">•</span>
            <p>{countdown !== null ? 'Countdown active...' : isHost ? 'You can start when ready' : `Waiting for ${hostName || 'host'} to start...`}</p>
          </div>
        </div>

        {/* Countdown */}
        {countdown !== null && (
          <div className="mb-8 p-6 bg-jungle-green/10 rounded-xl border-2 border-jungle-green text-center">
            <p className="text-lg font-semibold text-jungle-green mb-2">
              Game starting in
            </p>
            <div className="text-6xl font-black text-jungle-green">
              {countdown}
            </div>
          </div>
        )}

        {/* Players list */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Players ({players.length}/{maxPlayers})
          </h2>
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-jungle-green rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{player.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{player.animal}</p>
                  </div>
                </div>
                {player.isReady && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                    Ready
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty settings */}
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">Match Difficulty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['easy', 'normal', 'hard'] as DifficultyMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleDifficultyChange(mode)}
                disabled={!isHost || difficultyLocked}
                className={`rounded-lg px-3 py-2 text-sm font-semibold border transition-colors ${
                  difficulty === mode
                    ? 'bg-jungle-green text-white border-jungle-green'
                    : 'bg-white text-gray-700 border-gray-300'
                } ${(!isHost || difficultyLocked) ? 'opacity-60 cursor-not-allowed' : 'hover:border-jungle-green'}`}
              >
                {DIFFICULTY_LABELS[mode]}
              </button>
            ))}
          </div>
          <p className="text-xs text-amber-900/80 mt-2">
            {isHost
              ? difficultyLocked
                ? 'Difficulty locked once countdown starts.'
                : 'You are host. Choose the best mode for your group.'
              : `Host selected: ${DIFFICULTY_LABELS[difficulty]}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleStartGame}
            className="flex-1 bg-jungle-green hover:bg-jungle-leaf"
            disabled={!canStart}
          >
            {countdown !== null ? 'Countdown Running' : isHost ? (players.length >= 2 ? 'Start Game' : 'Need 2+ Players') : 'Host Controls Start'}
          </Button>
          <Button
            onClick={handleLeave}
            variant="outline"
            className="flex-1"
          >
            Leave Lobby
          </Button>
          <Button
            onClick={() => router.push('/leaderboard')}
            variant="outline"
            className="flex-1"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}

