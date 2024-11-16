import React from 'react';
import { Medal } from 'lucide-react';

interface LeaderboardEntry {
  playerName: string;
  totalScore: number;
  rank: number;
}

interface Props {
  entries: LeaderboardEntry[];
  title: string;
}

export default function Leaderboard({ entries, title }: Props) {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Medal className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.playerName}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${getMedalColor(entry.rank)}`}>
                #{entry.rank}
              </span>
              <span className="font-medium text-gray-800">{entry.playerName}</span>
            </div>
            <span className="text-lg font-semibold text-indigo-600">
              {entry.totalScore} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}