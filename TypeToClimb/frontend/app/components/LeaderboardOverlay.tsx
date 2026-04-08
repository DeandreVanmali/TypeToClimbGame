'use client';

interface LeaderboardOverlayProps {
  isOpen: boolean;
  onBackToHome?: () => void;
  rounds?: number;
  finalHeight?: number;
  winnerName?: string;
  isWinner?: boolean;
}

export default function LeaderboardOverlay({
  isOpen,
  onBackToHome,
  rounds = 0,
  finalHeight = 0,
  winnerName,
  isWinner,
}: LeaderboardOverlayProps) {
  if (!isOpen) return null;

  const isMultiplayerResult = typeof isWinner === 'boolean' && Boolean(winnerName);
  const title = isMultiplayerResult
    ? isWinner
      ? 'YOU WON THE GAME!'
      : `${winnerName?.toUpperCase()} WON THE GAME!`
    : 'YOU REACHED THE TOP!';
  const subtitle = isMultiplayerResult
    ? isWinner
      ? 'You climbed to the canopy before everyone else!'
      : 'Better luck next climb — you can still compare your own score from this run.'
    : 'The monkey made it to the canopy!';
  const icon = isMultiplayerResult ? (isWinner ? '🏆' : '🎯') : '🎉';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-jungle-green">
        <div className="bg-gradient-to-r from-jungle-green to-jungle-leaf text-white px-6 py-5 text-center rounded-t-2xl">
          <div className="text-6xl mb-2">{icon}</div>
          <h2 className="text-3xl font-black mb-1">{title}</h2>
          <p className="text-white/90 mb-4">{subtitle}</p>
          <div className="flex justify-center gap-6">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-sm opacity-90">Final Height</p>
              <p className="text-2xl font-bold">{finalHeight}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-sm opacity-90">Your Words Typed</p>
              <p className="text-2xl font-bold">{rounds}</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center text-gray-600">
          <p className="mb-4">
            {isMultiplayerResult
              ? isWinner
                ? 'Great job — you were the fastest climber! 🎮'
                : `${winnerName} finished first this round. 🎮`
              : 'Great job! 🎮'}
          </p>
          <p className="text-sm">Check the leaderboard page to see how you rank!</p>
        </div>
        {onBackToHome && (
          <div className="px-6 pb-6 flex justify-center">
            <button
              onClick={onBackToHome}
              className="bg-jungle-green text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-jungle-leaf transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
