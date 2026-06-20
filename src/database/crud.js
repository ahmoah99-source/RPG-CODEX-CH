// ─── Characters ─────────────────────────────────────────────

export async function createCharacter(db, { name, race_id, category_id, base_strength, base_agility, base_intelligence, base_vitality, base_willpower, base_luck }) {
  const result = await db.runAsync(
    `INSERT INTO characters (name, race_id, category_id, base_strength, base_agility, base_intelligence, base_vitality, base_willpower, base_luck)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, race_id, category_id, base_strength ?? 10, base_agility ?? 10, base_intelligence ?? 10, base_vitality ?? 10, base_willpower ?? 10, base_luck ?? 10]
  );
  return result.lastInsertRowId;
}

export async function getAllCharacters(db) {
  return db.getAllAsync(`
    SELECT c.*, r.name as race_name, cat.name as category_name, l.level as level_number
    FROM characters c
    JOIN races r ON c.race_id = r.id
    JOIN categories cat ON c.category_id = cat.id
    JOIN levels l ON c.level_id = l.level
    ORDER BY c.updated_at DESC
  `);
}

export async function getCharacterById(db, id) {
  return db.getFirstAsync(`
    SELECT c.*, r.name as race_name, cat.name as category_name, l.level as level_number,
      l.health_multiplier, l.mana_multiplier, l.attack_multiplier, l.defense_multiplier,
      r.strength_bonus as race_str, r.agility_bonus as race_agi, r.intelligence_bonus as race_int,
      r.vitality_bonus as race_vit, r.willpower_bonus as race_wil, r.luck_bonus as race_lck,
      cat.power_multiplier
    FROM characters c
    JOIN races r ON c.race_id = r.id
    JOIN categories cat ON c.category_id = cat.id
    JOIN levels l ON c.level_id = l.level
    WHERE c.id = ?
  `, [id]);
}

export async function updateCharacter(db, id, fields) {
  const sets = [];
  const values = [];
  const allowed = ['name', 'base_strength', 'base_agility', 'base_intelligence', 'base_vitality', 'base_willpower', 'base_luck', 'level_id'];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (sets.length === 0) return;
  sets.push("updated_at = datetime('now')");
  values.push(id);
  await db.runAsync(`UPDATE characters SET ${sets.join(', ')} WHERE id = ?`, values);
}

export async function deleteCharacter(db, id) { await db.runAsync('DELETE FROM characters WHERE id = ?', [id]); }

// ─── Lineages ──────────────────────────────────────────────

export async function addLineage(db, name) { await db.runAsync('INSERT INTO lineages (name) VALUES (?)', [name]); }
export async function getAllLineages(db) { return await db.getAllAsync('SELECT * FROM lineages ORDER BY name'); }
export async function deleteLineage(db, id) { await db.runAsync('DELETE FROM lineages WHERE id = ?', [id]); }

// ─── Races ──────────────────────────────────────────────────

export async function addRace(db, r) {
  await db.runAsync(
    `INSERT INTO races (name, lineage_id, strength_bonus, agility_bonus, vitality_bonus, willpower_bonus, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [r.name, r.lineage_id, r.str, r.agi, r.vit, r.wil, r.desc]
  );
}

export async function getAllRaces(db) {
  return await db.getAllAsync(`
    SELECT r.*, l.name as lineage_name 
    FROM races r 
    LEFT JOIN lineages l ON r.lineage_id = l.id
    ORDER BY r.name
  `);
}

export async function deleteRace(db, id) { await db.runAsync('DELETE FROM races WHERE id = ?', [id]); }

// ─── Levels ─────────────────────────────────────────────────

export async function getAllLevels(db) { return db.getAllAsync('SELECT * FROM levels ORDER BY level'); }

export async function addLevel(db, { level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required }) {
  await db.runAsync(
    `INSERT INTO levels (level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required) VALUES (?, ?, ?, ?, ?, ?)`,
    [level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required]
  );
}

export async function updateLevel(db, id, { level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required }) {
  await db.runAsync(
    `UPDATE levels SET level = ?, health_multiplier = ?, mana_multiplier = ?, attack_multiplier = ?, defense_multiplier = ?, experience_required = ? WHERE id = ?`,
    [level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required, id]
  );
}

export async function deleteLevel(db, id) { await db.runAsync('DELETE FROM levels WHERE id = ?', [id]); }

// ─── Talent Ranks ────────────────────────────────────────────

export async function getAllRanks(db) { return await db.getAllAsync('SELECT * FROM talent_ranks ORDER BY id'); }
export async function addRank(db, { name, icon_url }) { await db.runAsync('INSERT INTO talent_ranks (name, icon_url) VALUES (?, ?)', [name, icon_url]); }

// ─── Categories ───────────────────────────────────────

export async function getAllCategories(db) { return await db.getAllAsync('SELECT * FROM categories ORDER BY name'); }
export async function addCategory(db, { name, description, icon_url, power_multiplier }) {
  await db.runAsync('INSERT INTO categories (name, description, icon_url, power_multiplier) VALUES (?, ?, ?, ?)', [name, description, icon_url, power_multiplier]);
}

// ─── Skills ──────────────────────────────────────────

export async function getAllSkills(db) {
  return db.getAllAsync(`
    SELECT s.*, c.name as category_name 
    FROM skills s 
    LEFT JOIN categories c ON s.category_id = c.id 
    ORDER BY s.name
  `);
}

export async function addSkill(db, s) {
  await db.runAsync(`INSERT INTO skills (name, category_id, description, icon_url, type, damage_multiplier, mana_cost, strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.name, s.category_id, s.description, s.icon_url, s.type, s.damage_multiplier, s.mana_cost, s.strength_bonus, s.agility_bonus, s.intelligence_bonus, s.vitality_bonus, s.willpower_bonus, s.luck_bonus]);
}

// ─── Talents ─────────────────────────────────────────────────

export async function getAllTalents(db) {
  return await db.getAllAsync(`
    SELECT t.*, r.name as rank_name, r.icon_url as rank_icon
    FROM talents t
    LEFT JOIN talent_ranks r ON t.rank_id = r.id
    ORDER BY t.name
  `);
}

export async function addTalent(db, t) {
  await db.runAsync(`INSERT INTO talents (name, description, icon_url, rank_id, strength_bonus, agility_bonus, vitality_bonus, willpower_bonus, strength_multiplier, agility_multiplier, vitality_multiplier, willpower_multiplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [t.name, t.description, t.icon_url, t.rank_id, t.strength_bonus, t.agility_bonus, t.vitality_bonus, t.willpower_bonus, t.strength_multiplier, t.agility_multiplier, t.vitality_multiplier, t.willpower_multiplier]);
}

export async function deleteTalent(db, id) { await db.runAsync('DELETE FROM talents WHERE id = ?', [id]); }

// ─── Weapons ─────────────────────────────────────────────────

export async function getAllWeapons(db) { return db.getAllAsync('SELECT * FROM weapons ORDER BY name'); }

export async function addWeapon(db, w) {
  await db.runAsync(`INSERT INTO weapons (name, description, icon_url, damage, type, min_level, strength_req, agility_req, intelligence_req, vitality_req, willpower_req, luck_req, base_health, base_mana, base_attack, base_defense) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [w.name, w.description, w.icon_url, w.damage, w.type, w.min_level, w.strength_req, w.agility_req, w.intelligence_req, w.vitality_req, w.willpower_req, w.luck_req, w.base_health, w.base_mana, w.base_attack, w.base_defense]);
}

export async function deleteWeapon(db, id) { await db.runAsync('DELETE FROM weapons WHERE id = ?', [id]); }
