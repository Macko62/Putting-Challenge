import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { Competition, Player, Score } from './types';
import CompetitionSelect from './components/CompetitionSelect';
import PlayerSelect from './components/PlayerSelect';
import ScoreInput from './components/ScoreInput';
import Leaderboard from './components/Leaderboard';

function App() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedTour, setSelectedTour] = useState<number>(1);
  const [existingScore, setExistingScore] = useState<Score | null>(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<any[]>([]);
  const [totalLeaderboard, setTotalLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    loadCompetitions();
    loadPlayers();
  }, []);

  useEffect(() => {
    if (selectedCompetition && selectedPlayer && selectedWeek && selectedTour) {
      loadExistingScore();
    } else {
      setExistingScore(null);
    }
  }, [selectedCompetition, selectedPlayer, selectedWeek, selectedTour]);

  const loadExistingScore = async () => {
    if (!selectedCompetition || !selectedPlayer) return;

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('competition_id', selectedCompetition.id)
      .eq('player_id', selectedPlayer.id)
      .eq('week', selectedWeek)
      .eq('tour', selectedTour)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      toast.error('Erreur lors du chargement des scores');
      return;
    }

    setExistingScore(data || null);
  };

  const loadCompetitions = async () => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des compétitions');
      return;
    }

    setCompetitions(data || []);
  };

  const loadPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Erreur lors du chargement des joueurs');
      return;
    }

    setPlayers(data || []);
  };

  const createNewCompetition = async () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const name = `${currentMonth} ${currentYear}`;

    const { data, error } = await supabase
      .from('competitions')
      .insert([{ name, is_active: true }])
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création de la compétition');
      return;
    }

    setCompetitions([data, ...competitions]);
    setSelectedCompetition(data);
    toast.success('Nouvelle compétition créée');
  };

  const addNewPlayer = async (name: string) => {
    const { data, error } = await supabase
      .from('players')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de l\'ajout du joueur');
      return;
    }

    setPlayers([...players, data]);
    setSelectedPlayer(data);
    toast.success('Nouveau joueur ajouté');
  };

  const handleScoreSave = async (scores: number[]) => {
    if (!selectedCompetition || !selectedPlayer) return;

    const totalScore = scores.reduce((acc, score, index) => acc + score * (index + 1), 0);

    const scoreData = {
      competition_id: selectedCompetition.id,
      player_id: selectedPlayer.id,
      week: selectedWeek,
      tour: selectedTour,
      trial1: scores[0],
      trial2: scores[1],
      trial3: scores[2],
      trial4: scores[3],
      trial5: scores[4],
      total_score: totalScore
    };

    const { error } = await supabase
      .from('scores')
      .upsert([scoreData], {
        onConflict: 'competition_id,player_id,week,tour'
      });

    if (error) {
      toast.error('Erreur lors de l\'enregistrement des scores');
      return;
    }

    toast.success('Scores enregistrés avec succès');
    await loadLeaderboards();
    await loadExistingScore();
  };

  const loadLeaderboards = async () => {
    if (!selectedCompetition) return;

    // Weekly leaderboard
    const { data: weeklyData } = await supabase
      .from('scores')
      .select(`
        total_score,
        players (name)
      `)
      .eq('competition_id', selectedCompetition.id)
      .eq('week', selectedWeek);

    if (weeklyData) {
      const weeklyEntries = weeklyData
        .reduce((acc: any[], score: any) => {
          const playerName = score.players.name;
          const existingEntry = acc.find(e => e.playerName === playerName);
          
          if (existingEntry) {
            existingEntry.totalScore += score.total_score;
          } else {
            acc.push({ playerName, totalScore: score.total_score });
          }
          
          return acc;
        }, [])
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setWeeklyLeaderboard(weeklyEntries);
    }

    // Total leaderboard
    const { data: totalData } = await supabase
      .from('scores')
      .select(`
        total_score,
        players (name)
      `)
      .eq('competition_id', selectedCompetition.id);

    if (totalData) {
      const totalEntries = totalData
        .reduce((acc: any[], score: any) => {
          const playerName = score.players.name;
          const existingEntry = acc.find(e => e.playerName === playerName);
          
          if (existingEntry) {
            existingEntry.totalScore += score.total_score;
          } else {
            acc.push({ playerName, totalScore: score.total_score });
          }
          
          return acc;
        }, [])
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setTotalLeaderboard(totalEntries);
    }
  };

  const handleEndCompetition = async () => {
    if (!selectedCompetition) return;

    if (!window.confirm('Êtes-vous sûr de vouloir terminer cette compétition ?')) {
      return;
    }

    const { error } = await supabase
      .from('competitions')
      .update({ is_active: false })
      .eq('id', selectedCompetition.id);

    if (error) {
      toast.error('Erreur lors de la clôture de la compétition');
      return;
    }

    toast.success('Compétition terminée avec succès');
    await loadCompetitions();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <CompetitionSelect
          competitions={competitions}
          selectedCompetition={selectedCompetition}
          onSelect={setSelectedCompetition}
          onCreateNew={createNewCompetition}
        />

        {selectedCompetition && (
          <>
            <PlayerSelect
              players={players}
              selectedPlayer={selectedPlayer}
              onSelect={setSelectedPlayer}
              onAddNew={addNewPlayer}
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((week) => (
                  <option key={week} value={week}>Semaine {week}</option>
                ))}
              </select>

              <select
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedTour}
                onChange={(e) => setSelectedTour(Number(e.target.value))}
              >
                {[1, 2].map((tour) => (
                  <option key={tour} value={tour}>Tour {tour}</option>
                ))}
              </select>
            </div>

            {selectedPlayer && (
              <ScoreInput
                week={selectedWeek}
                tour={selectedTour}
                existingScore={existingScore}
                onSave={handleScoreSave}
              />
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <Leaderboard
                entries={weeklyLeaderboard}
                title={`Classement Semaine ${selectedWeek}`}
              />
              <Leaderboard
                entries={totalLeaderboard}
                title="Classement Général"
              />
            </div>

            {selectedWeek === 4 && selectedCompetition.is_active && (
              <button
                onClick={handleEndCompetition}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Terminer la compétition
              </button>
            )}
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;