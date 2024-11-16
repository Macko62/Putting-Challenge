import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlus, Users } from 'lucide-react';

interface Props {
  players: Player[];
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
  onAddNew: (name: string) => void;
}

export default function PlayerSelect({ players, selectedPlayer, onSelect, onAddNew }: Props) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddNew = () => {
    if (newPlayerName.trim()) {
      onAddNew(newPlayerName.trim());
      setNewPlayerName('');
      setIsAddingNew(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Sélection du joueur</h2>
      </div>

      <div className="space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedPlayer?.id || ''}
          onChange={(e) => {
            const player = players.find(p => p.id === Number(e.target.value));
            if (player) onSelect(player);
          }}
        >
          <option value="">Sélectionnez un joueur</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center w-full gap-2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <UserPlus className="w-5 h-5" />
            Ajouter un nouveau joueur
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nom du joueur"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Valider
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}