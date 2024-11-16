import React, { useState, useEffect } from 'react';
import { Score } from '../types';
import { Target } from 'lucide-react';

interface Props {
  week: number;
  tour: number;
  existingScore: Score | null;
  onSave: (scores: number[]) => void;
}

export default function ScoreInput({ week, tour, existingScore, onSave }: Props) {
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (existingScore) {
      setScores([
        existingScore.trial1,
        existingScore.trial2,
        existingScore.trial3,
        existingScore.trial4,
        existingScore.trial5
      ]);
    }
  }, [existingScore]);

  const handleScoreChange = (index: number, value: number) => {
    const newValue = Math.max(0, Math.min(5, value));
    const newScores = [...scores];
    newScores[index] = newValue;
    setScores(newScores);
  };

  const calculateWeightedScore = (score: number, index: number) => {
    return score * (index + 1);
  };

  const totalScore = scores.reduce((acc, score, index) => acc + calculateWeightedScore(score, index), 0);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Semaine {week} - Tour {tour}
        </h2>
      </div>

      <div className="space-y-4">
        {scores.map((score, index) => (
          <div key={index} className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium text-gray-700">
              Essai {index + 1} (×{index + 1})
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={score}
              onChange={(e) => handleScoreChange(index, parseInt(e.target.value) || 0)}
              className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="text-sm text-gray-600">
              = {calculateWeightedScore(score, index)} points
            </span>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Score total:</span>
            <span className="text-2xl font-bold text-indigo-600">{totalScore}</span>
          </div>
        </div>

        <button
          onClick={() => onSave(scores)}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Enregistrer les scores
        </button>
      </div>
    </div>
  );
}