-- Create tables
CREATE TABLE IF NOT EXISTS competitions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scores (
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT REFERENCES competitions(id) ON DELETE CASCADE,
    player_id BIGINT REFERENCES players(id) ON DELETE CASCADE,
    week INTEGER CHECK (week BETWEEN 1 AND 4),
    tour INTEGER CHECK (tour BETWEEN 1 AND 2),
    trial1 INTEGER CHECK (trial1 BETWEEN 0 AND 5),
    trial2 INTEGER CHECK (trial2 BETWEEN 0 AND 5),
    trial3 INTEGER CHECK (trial3 BETWEEN 0 AND 5),
    trial4 INTEGER CHECK (trial4 BETWEEN 0 AND 5),
    trial5 INTEGER CHECK (trial5 BETWEEN 0 AND 5),
    total_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, player_id, week, tour)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scores_competition_id ON scores(competition_id);
CREATE INDEX IF NOT EXISTS idx_scores_player_id ON scores(player_id);
CREATE INDEX IF NOT EXISTS idx_scores_week ON scores(week);
CREATE INDEX IF NOT EXISTS idx_scores_tour ON scores(tour);
CREATE INDEX IF NOT EXISTS idx_competitions_is_active ON competitions(is_active);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);