import React from 'react';
import { Competition } from '../types';
import { Trophy } from 'lucide-react';

interface Props {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  onSelect: (competition: Competition) => void;
  onCreateNew: () => void;
}

export default function CompetitionSelect({ competitions, selectedCompetition, onSelect, onCreateNew }: Props) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const defaultName = `${currentMonth} ${currentYear}`;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Sélection de la compétition</h2>
      </div>
      
      <div className="space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedCompetition?.id || ''}
          onChange={(e) => {
            const competition = competitions.find(c => c.id === Number(e.target.value));
            if (competition) onSelect(competition);
          }}
        >
          <option value="">Sélectionnez une compétition</option>
          {competitions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name}
            </option>
          ))}
        </select>

        <button
          onClick={onCreateNew}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Nouvelle compétition ({defaultName})
        </button>
      </div>
    </div>
  );
}