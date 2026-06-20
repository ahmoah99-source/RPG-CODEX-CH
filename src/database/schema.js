-- Races
CREATE TABLE IF NOT EXISTS races (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  vitality_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0
);

-- Levels
CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL UNIQUE,
  health_multiplier REAL DEFAULT 1.0,
  mana_multiplier REAL DEFAULT 1.0,
  attack_multiplier REAL DEFAULT 1.0,
  defense_multiplier REAL DEFAULT 1.0,
  experience_required INTEGER DEFAULT 0
);

-- Talent Ranks
CREATE TABLE IF NOT EXISTS talent_ranks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT
);

-- Talents
CREATE TABLE IF NOT EXISTS talents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  rank_id INTEGER,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0,
  vitality_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  strength_multiplier REAL DEFAULT 0,
  agility_multiplier REAL DEFAULT 0,
  vitality_multiplier REAL DEFAULT 0,
  willpower_multiplier REAL DEFAULT 0,
  FOREIGN KEY (rank_id) REFERENCES talent_ranks(id)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  power_multiplier REAL DEFAULT 1.0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category_id INTEGER,
  description TEXT,
  icon_url TEXT,
  type TEXT,
  damage_multiplier REAL DEFAULT 1.0,
  mana_cost REAL DEFAULT 0,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  vitality_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Characters & Junctions (باقي الجداول كما هي)
...
