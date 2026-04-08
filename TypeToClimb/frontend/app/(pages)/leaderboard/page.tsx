'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import JungleIcon from '@/graphics/JungleIcon';

interface LeaderboardEntry {
  id: number;
  player_name: string;
  animal: string;
  score: number;
  created_at: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || `http://${window.location.hostname}:5000`;
      const response = await fetch(`${backendUrl}/api/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getRankDisplay = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00bf8f] to-[#001510] p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <JungleIcon className="w-12 h-12" />
              <h1 className="text-4xl font-black text-jungle-green">Leaderboard</h1>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchLeaderboard}
                variant="outline"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="bg-jungle-green hover:bg-jungle-leaf"
              >
                Back to Home
              </Button>
            </div>
          </div>

          {/* Auto-refresh toggle */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="auto-refresh">Auto-refresh every 10 seconds</label>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-red-600">
              <p className="font-semibold mb-2">Failed to load leaderboard</p>
              <p className="text-sm">{error}</p>
              <Button onClick={fetchLeaderboard} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : loading && entries.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <div className="animate-pulse">Loading leaderboard...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg font-semibold mb-2">No entries yet!</p>
              <p className="text-sm">Be the first to climb the vine!</p>
              <Button onClick={() => router.push('/login')} className="mt-4 bg-jungle-green hover:bg-jungle-leaf">
                Start Playing
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-jungle-green/10">
                  <TableHead className="w-20 font-bold">Rank</TableHead>
                  <TableHead className="font-bold">Player</TableHead>
                  <TableHead className="font-bold">Animal</TableHead>
                  <TableHead className="text-right font-bold">Score</TableHead>
                  <TableHead className="text-right font-bold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow
                    key={entry.id}
                    className={`
                      ${index < 3 ? 'bg-amber-50/50' : ''}
                      ${index === 0 ? 'font-semibold' : ''}
                    `}
                  >
                    <TableCell className="text-2xl">
                      {getRankDisplay(index)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.player_name}
                    </TableCell>
                    <TableCell className="capitalize text-gray-600">
                      {entry.animal}
                    </TableCell>
                    <TableCell className="text-right font-bold text-jungle-green">
                      {entry.score}
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Stats footer */}
        {entries.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-jungle-green">{entries.length}</p>
                <p className="text-sm text-gray-600">Total Climbs</p>
              </div>
              <div>
                <p className="text-3xl font-black text-jungle-green">{entries[0]?.score || 0}</p>
                <p className="text-sm text-gray-600">Top Score</p>
              </div>
              <div>
                <p className="text-3xl font-black text-jungle-green">
                  {Math.round(entries.reduce((sum, e) => sum + e.score, 0) / entries.length) || 0}
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
