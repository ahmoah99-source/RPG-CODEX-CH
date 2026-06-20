const SCHEMA_SQL = `
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

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_health INTEGER DEFAULT 100,
  base_mana INTEGER DEFAULT 50,
  base_attack INTEGER DEFAULT 10,
  base_defense INTEGER DEFAULT 5,
  preferred_stat TEXT
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
  rank_id INTEGER,
  icon_url TEXT,
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

-- Categories (جدول جديد للفئات)
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  power_multiplier REAL DEFAULT 0
);

-- Skills (تم تعديله ليرتبط بجدول الفئات)
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category_id INTEGER,
  description TEXT,
  type TEXT,
  damage_multiplier REAL DEFAULT 1.0,
  mana_cost REAL DEFAULT 0,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0,
  intelligence_bonus INTEGER DEFAULT 0,
  vitality_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  luck_bonus INTEGER DEFAULT 0,
  icon_url TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Characters
CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  race_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  level_id INTEGER DEFAULT 1,
  base_strength INTEGER DEFAULT 10,
  base_agility INTEGER DEFAULT 10,
  base_intelligence INTEGER DEFAULT 10,
  base_vitality INTEGER DEFAULT 10,
  base_willpower INTEGER DEFAULT 10,
  base_luck INTEGER DEFAULT 10,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (race_id) REFERENCES races(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (level_id) REFERENCES levels(level)
);

-- Weapons
CREATE TABLE IF NOT EXISTS weapons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  weight REAL DEFAULT 0,
  attack_bonus INTEGER DEFAULT 0,
  defense_bonus INTEGER DEFAULT 0,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0
);

-- Junction Tables
CREATE TABLE IF NOT EXISTS character_skills (
  character_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  PRIMARY KEY (character_id, skill_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS character_talents (
  character_id INTEGER NOT NULL,
  talent_id INTEGER NOT NULL,
  PRIMARY KEY (character_id, talent_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id)
);

CREATE TABLE IF NOT EXISTS character_weapons (
  character_id INTEGER NOT NULL,
  weapon_id INTEGER NOT NULL,
  is_equipped INTEGER DEFAULT 0,
  PRIMARY KEY (character_id, weapon_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (weapon_id) REFERENCES weapons(id)
);
`;

export default SCHEMA_SQL;
