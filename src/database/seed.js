const SEED_SQL = `
-- Races
INSERT OR IGNORE INTO races (name, description, strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus) VALUES
  ('Anubari', 'Desert wolf kin, fierce and enduring', 3, 2, 0, 2, 0, 1),
  ('Ra''shen', 'Sun-touched scholars of the golden temples', 0, 1, 4, 0, 3, 0),
  ('Sekhmeti', 'Lion-born warriors of the red sands', 4, 1, 0, 3, 0, 0),
  ('Thoth''ari', 'Ibis-headed sages of the moon', 0, 0, 3, 0, 4, 1),
  ('Nileborn', 'River folk, balanced in all things', 1, 2, 1, 2, 1, 1);

-- Levels (1-10)
INSERT OR IGNORE INTO levels (level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required) VALUES
  (1, 1.0, 1.0, 1.0, 1.0, 0),
  (2, 1.15, 1.12, 1.10, 1.08, 100),
  (3, 1.30, 1.24, 1.20, 1.16, 300),
  (4, 1.45, 1.36, 1.30, 1.24, 600),
  (5, 1.60, 1.48, 1.40, 1.32, 1000),
  (6, 1.75, 1.60, 1.50, 1.40, 1500),
  (7, 1.90, 1.72, 1.60, 1.48, 2100),
  (8, 2.05, 1.84, 1.70, 1.56, 2800),
  (9, 2.20, 1.96, 1.80, 1.64, 3600),
  (10, 2.35, 2.08, 1.90, 1.72, 4500);

-- Classes
INSERT OR IGNORE INTO classes (name, description, base_health, base_mana, base_attack, base_defense, preferred_stat) VALUES
  ('Pharaoh Guard', 'Elite protectors of the divine ruler', 200, 30, 18, 14, 'strength'),
  ('Sun Priest', 'Channelers of solar energy', 80, 180, 8, 6, 'intelligence'),
  ('Sand Assassin', 'Silent death from the dunes', 120, 60, 14, 8, 'agility'),
  ('Scarab Knight', 'Armored warriors blessed by the beetle god', 180, 40, 16, 18, 'vitality'),
  ('Moon Sage', 'Keepers of forbidden knowledge', 90, 160, 6, 10, 'willpower');

-- Skills
INSERT OR IGNORE INTO skills (name, description, strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus) VALUES
  ('Desert Stride', 'Move swiftly across sand', 0, 3, 0, 0, 0, 0),
  ('Solar Flare', 'Harness sunlight for power', 1, 0, 3, 0, 1, 0),
  ('Iron Skin', 'Harden the body against blows', 2, 0, 0, 2, 0, 0),
  ('Keen Eye', 'Spot weakness in any defense', 0, 1, 2, 0, 0, 2),
  ('Sand Veil', 'Become one with the desert', 0, 2, 0, 1, 1, 0),
  ('Pyramid Focus', 'Channel the power of the pyramids', 0, 0, 0, 0, 4, 0),
  ('Beetle Shell', 'Grow a protective carapace', 0, 0, 0, 3, 0, 1),
  ('Falcon Dive', 'Strike from above with deadly precision', 1, 3, 0, 0, 0, 0);

-- Talents
INSERT OR IGNORE INTO talents (name, description, strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus, strength_multiplier, agility_multiplier, intelligence_multiplier, vitality_multiplier, willpower_multiplier, luck_multiplier) VALUES
  ('Eye of Ra', 'The sun god grants supreme power', 2, 0, 0, 0, 0, 0, 0.10, 0, 0, 0, 0, 0),
  ('Desert Wind', 'Move like the sirocco', 0, 2, 0, 0, 0, 0, 0, 0.10, 0, 0, 0, 0),
  ('Sphinx Riddle', 'Knowledge beyond mortal ken', 0, 0, 3, 0, 0, 0, 0, 0, 0.12, 0, 0, 0),
  ('Scarab''s Gift', 'Endurance of the eternal beetle', 0, 0, 0, 2, 0, 0, 0, 0, 0, 0.10, 0, 0),
  ('Maat''s Blessing', 'Balanced by cosmic order', 1, 1, 1, 1, 1, 0, 0.05, 0.05, 0.05, 0.05, 0.05, 0),
  ('Ankh Vitality', 'Touch of eternal life', 0, 0, 0, 3, 1, 0, 0, 0, 0, 0.15, 0.05, 0),
  ('Jackal''s Luck', 'Fortune favors the cunning', 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0.20);

-- Weapons
INSERT OR IGNORE INTO weapons (name, description, weight, attack_bonus, defense_bonus, strength_bonus, agility_bonus) VALUES
  ('Khopesh of Ra', 'A crescent blade imbued with solar fire', 8, 12, 2, 2, 0),
  ('Anubis Dagger', 'A ceremonial blade that strikes from shadows', 2, 8, 0, 0, 2),
  ('Scarab Shield', 'A living shield of hardened carapace', 10, 2, 14, 1, 0),
  ('Sphinx Staff', 'A staff of ancient wisdom', 4, 6, 4, 0, 0),
  ('Sun Bow', 'Fires arrows of concentrated light', 3, 10, 0, 0, 3),
  ('Obelisk Hammer', 'Crushes like a falling monument', 14, 18, 6, 4, -2),
  ('Moon Sickle', 'Harvests souls under the crescent moon', 3, 9, 1, 0, 1);
`;

export default SEED_SQL;
