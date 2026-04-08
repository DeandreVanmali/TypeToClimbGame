'use client';

interface GameStatsProps {
  height: number;
  lastIncrement: number;
  accuracy: number;
  timeMs: number;
}

export function GameStats({ height, lastIncrement, accuracy, timeMs }: GameStatsProps) {
  const formatTime = (ms: number) => {
    const seconds = ms / 1000;
    return seconds.toFixed(1) + 's';
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <h3 className="text-sm font-bold text-jungle-green mb-3">Session Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Total Height" value={height.toString()} />
        <StatBox label="Last Score" value={`+${lastIncrement}`} highlight={lastIncrement > 0} />
        <StatBox label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
        <StatBox label="Time" value={formatTime(timeMs)} />
      </div>
      <div className="mt-4 p-3 bg-jungle-green/10 rounded text-xs text-jungle-green">
        <p className="font-semibold mb-1">📊 How Scoring Works:</p>
        <p>Longer words and faster typing give more height. Clean, quick words climb the vine fastest.</p>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-2 rounded text-center ${highlight ? 'bg-jungle-leaf/20 border-2 border-jungle-leaf' : 'bg-gray-50'}`}>
      <div className="text-xs text-gray-600 font-semibold">{label}</div>
      <div className={`text-lg font-mono font-bold ${highlight ? 'text-jungle-leaf' : 'text-jungle-brown'}`}>{value}</div>
    </div>
  );
}
