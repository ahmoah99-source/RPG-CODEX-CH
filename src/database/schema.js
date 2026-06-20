-- 1. الجداول الأساسية

CREATE TABLE IF NOT EXISTS lineages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS races (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lineage_id INTEGER,
  strength_bonus INTEGER DEFAULT 0,
  agility_bonus INTEGER DEFAULT 0,
  vitality_bonus INTEGER DEFAULT 0,
  willpower_bonus INTEGER DEFAULT 0,
  description TEXT,
  FOREIGN KEY (lineage_id) REFERENCES lineages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL UNIQUE,
  health_multiplier REAL DEFAULT 1.0,
  mana_multiplier REAL DEFAULT 1.0,
  attack_multiplier REAL DEFAULT 1.0,
  defense_multiplier REAL DEFAULT 1.0,
  experience_required INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  power_multiplier REAL DEFAULT 1.0
);

-- 2. جداول المهارات والمواهب

CREATE TABLE IF NOT EXISTS talent_ranks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT
);

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

-- 3. الأسلحة

CREATE TABLE IF NOT EXISTS weapons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  damage INTEGER DEFAULT 0,
  type TEXT,
  min_level INTEGER DEFAULT 1,
  strength_req INTEGER DEFAULT 0,
  agility_req INTEGER DEFAULT 0,
  intelligence_req INTEGER DEFAULT 0,
  vitality_req INTEGER DEFAULT 0,
  willpower_req INTEGER DEFAULT 0,
  luck_req INTEGER DEFAULT 0,
  base_health INTEGER DEFAULT 0,
  base_mana INTEGER DEFAULT 0,
  base_attack INTEGER DEFAULT 0,
  base_defense INTEGER DEFAULT 0
);

-- 4. الشخصيات والعلاقات

CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  race_id INTEGER,
  category_id INTEGER,
  level_id INTEGER DEFAULT 1,
  base_strength INTEGER DEFAULT 10,
  base_agility INTEGER DEFAULT 10,
  base_intelligence INTEGER DEFAULT 10,
  base_vitality INTEGER DEFAULT 10,
  base_willpower INTEGER DEFAULT 10,
  base_luck INTEGER DEFAULT 10,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (race_id) REFERENCES races(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (level_id) REFERENCES levels(level)
);

CREATE TABLE IF NOT EXISTS character_skills (
  character_id INTEGER,
  skill_id INTEGER,
  PRIMARY KEY (character_id, skill_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS character_talents (
  character_id INTEGER,
  talent_id INTEGER,
  PRIMARY KEY (character_id, talent_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES talents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS character_weapons (
  character_id INTEGER,
  weapon_id INTEGER,
  is_equipped BOOLEAN DEFAULT 0,
  PRIMARY KEY (character_id, weapon_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (weapon_id) REFERENCES weapons(id) ON DELETE CASCADE
);
