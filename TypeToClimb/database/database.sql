-- Active game lobbies
CREATE TABLE IF NOT EXISTS lobbies (
    id         SERIAL PRIMARY KEY,
    code       CHAR(6) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players in a lobby session (removed when the lobby ends)
CREATE TABLE IF NOT EXISTS players (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    animal    VARCHAR(50)  NOT NULL DEFAULT 'monkey',
    lobby_id  INT REFERENCES lobbies(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- All-time leaderboard (persists after lobbies and players are gone)
CREATE TABLE IF NOT EXISTS scores (
    id          SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    animal      VARCHAR(50)  NOT NULL DEFAULT 'monkey',
    score       INT          NOT NULL CHECK (score >= 0),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);