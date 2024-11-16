export interface Player {
  id: number;
  name: string;
  created_at: string;
}

export interface Competition {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface Score {
  id: number;
  competition_id: number;
  player_id: number;
  week: number;
  tour: number;
  trial1: number;
  trial2: number;
  trial3: number;
  trial4: number;
  trial5: number;
  total_score: number;
  created_at: string;
}