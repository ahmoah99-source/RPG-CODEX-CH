// ─── Characters ─────────────────────────────────────────────

export async function createCharacter(db, { name, race_id, class_id, base_strength, base_agility, base_intelligence, base_vitality, base_willpower, base_luck }) {
  const result = await db.runAsync(
    `INSERT INTO characters (name, race_id, class_id, base_strength, base_agility, base_intelligence, base_vitality, base_willpower, base_luck)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, race_id, class_id, base_strength ?? 10, base_agility ?? 10, base_intelligence ?? 10, base_vitality ?? 10, base_willpower ?? 10, base_luck ?? 10]
  );
  return result.lastInsertRowId;
}

export async function getAllCharacters(db) {
  return db.getAllAsync(`
    SELECT c.*, r.name as race_name, cl.name as class_name, l.level as level_number
    FROM characters c
    JOIN races r ON c.race_id = r.id
    JOIN classes cl ON c.class_id = cl.id
    JOIN levels l ON c.level_id = l.level
    ORDER BY c.updated_at DESC
  `);
}

export async function getCharacterById(db, id) {
  return db.getFirstAsync(`
    SELECT c.*, r.name as race_name, cl.name as class_name, l.level as level_number,
      l.health_multiplier, l.mana_multiplier, l.attack_multiplier, l.defense_multiplier,
      r.strength_bonus as race_str, r.agility_bonus as race_agi, r.intelligence_bonus as race_int,
      r.vitality_bonus as race_vit, r.willpower_bonus as race_wil, r.luck_bonus as race_lck,
      cl.base_health, cl.base_mana, cl.base_attack, cl.base_defense
    FROM characters c
    JOIN races r ON c.race_id = r.id
    JOIN classes cl ON c.class_id = cl.id
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

export async function deleteCharacter(db, id) {
  await db.runAsync('DELETE FROM characters WHERE id = ?', [id]);
}

// ─── Races ──────────────────────────────────────────────────

export async function getAllRaces(db) {
  return db.getAllAsync('SELECT * FROM races ORDER BY name');
}

// ─── Classes ────────────────────────────────────────────────

export async function getAllClasses(db) {
  return db.getAllAsync('SELECT * FROM classes ORDER BY name');
}

// ─── Levels ─────────────────────────────────────────────────

export async function getAllLevels(db) {
  return db.getAllAsync('SELECT * FROM levels ORDER BY level');
}

// ─── Skills ─────────────────────────────────────────────────

export async function getAllSkills(db) {
  return db.getAllAsync('SELECT * FROM skills ORDER BY name');
}

export async function getSkillsForCharacter(db, characterId) {
  return db.getAllAsync(`
    SELECT s.* FROM skills s
    JOIN character_skills cs ON s.id = cs.skill_id
    WHERE cs.character_id = ?
  `, [characterId]);
}

export async function addSkillToCharacter(db, characterId, skillId) {
  await db.runAsync(
    'INSERT OR IGNORE INTO character_skills (character_id, skill_id) VALUES (?, ?)',
    [characterId, skillId]
  );
}

export async function removeSkillFromCharacter(db, characterId, skillId) {
  await db.runAsync(
    'DELETE FROM character_skills WHERE character_id = ? AND skill_id = ?',
    [characterId, skillId]
  );
}

// ─── Talents ─────────────────────────────────────────────────

export async function getAllTalents(db) {
  return db.getAllAsync('SELECT * FROM talents ORDER BY name');
}

export async function getTalentsForCharacter(db, characterId) {
  return db.getAllAsync(`
    SELECT t.* FROM talents t
    JOIN character_talents ct ON t.id = ct.talent_id
    WHERE ct.character_id = ?
  `, [characterId]);
}

export async function addTalentToCharacter(db, characterId, talentId) {
  await db.runAsync(
    'INSERT OR IGNORE INTO character_talents (character_id, talent_id) VALUES (?, ?)',
    [characterId, talentId]
  );
}

export async function removeTalentFromCharacter(db, characterId, talentId) {
  await db.runAsync(
    'DELETE FROM character_talents WHERE character_id = ? AND talent_id = ?',
    [characterId, talentId]
  );
}

// ─── Weapons ─────────────────────────────────────────────────

export async function getAllWeapons(db) {
  return db.getAllAsync('SELECT * FROM weapons ORDER BY name');
}

export async function getWeaponsForCharacter(db, characterId) {
  return db.getAllAsync(`
    SELECT w.*, cw.is_equipped FROM weapons w
    JOIN character_weapons cw ON w.id = cw.weapon_id
    WHERE cw.character_id = ?
  `, [characterId]);
}

export async function addWeaponToCharacter(db, characterId, weaponId, isEquipped = 0) {
  await db.runAsync(
    'INSERT OR IGNORE INTO character_weapons (character_id, weapon_id, is_equipped) VALUES (?, ?, ?)',
    [characterId, weaponId, isEquipped ? 1 : 0]
  );
}

export async function removeWeaponFromCharacter(db, characterId, weaponId) {
  await db.runAsync(
    'DELETE FROM character_weapons WHERE character_id = ? AND weapon_id = ?',
    [characterId, weaponId]
  );
}

export async function equipWeapon(db, characterId, weaponId) {
  await db.runAsync(
    'UPDATE character_weapons SET is_equipped = 0 WHERE character_id = ?',
    [characterId]
  );
  await db.runAsync(
    'UPDATE character_weapons SET is_equipped = 1 WHERE character_id = ? AND weapon_id = ?',
    [characterId, weaponId]
  );
}
