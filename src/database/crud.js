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

export async function addLevel(db, { level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required }) {
  await db.runAsync(
    `INSERT INTO levels (level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required) VALUES (?, ?, ?, ?, ?, ?)`,
    [level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required]
  );
}

export async function deleteLevel(db, id) {
  await db.runAsync('DELETE FROM levels WHERE id = ?', [id]);
}

export async function updateLevel(db, id, { level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required }) {
  await db.runAsync(
    `UPDATE levels SET level = ?, health_multiplier = ?, mana_multiplier = ?, attack_multiplier = ?, defense_multiplier = ?, experience_required = ? WHERE id = ?`,
    [level, health_multiplier, mana_multiplier, attack_multiplier, defense_multiplier, experience_required, id]
  );
}

// ─── Talent Ranks ────────────────────────────────────────────

export async function getAllRanks(db) {
  return await db.getAllAsync('SELECT * FROM talent_ranks ORDER BY id');
}

export async function addRank(db, { name, icon_url }) {
  await db.runAsync('INSERT INTO talent_ranks (name, icon_url) VALUES (?, ?)', [name, icon_url]);
}

// ─── Categories ───────────────────────────────────────

export async function getAllCategories(db) {
  return await db.getAllAsync('SELECT * FROM categories ORDER BY name');
}

export async function addCategory(db, categoryData) {
  await db.runAsync('INSERT INTO categories (name, description, icon_url, power_multiplier) VALUES (?, ?, ?, ?)', 
  [categoryData.name, categoryData.description, categoryData.icon_url, categoryData.power_multiplier]);
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

export async function addSkill(db, skillData) {
  const query = `
    INSERT INTO skills (
      name, category_id, description, icon_url, type, 
      damage_multiplier, mana_cost, strength_bonus, agility_bonus, 
      intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
  const params = [
    skillData.name, skillData.category_id, skillData.description, skillData.icon_url, skillData.type,
    skillData.damage_multiplier, skillData.mana_cost, skillData.strength_bonus, skillData.agility_bonus, 
    skillData.intelligence_bonus, skillData.vitality_bonus, skillData.willpower_bonus, skillData.luck_bonus
  ];
  
  await db.runAsync(query, params);
}

export async function getSkillsForCharacter(db, characterId) {
  return db.getAllAsync(`
    SELECT s.* FROM skills s
    JOIN character_skills cs ON s.id = cs.skill_id
    WHERE cs.character_id = ?
  `, [characterId]);
}

export async function addSkillToCharacter(db, characterId, skillId) {
  await db.runAsync('INSERT OR IGNORE INTO character_skills (character_id, skill_id) VALUES (?, ?)', [characterId, skillId]);
}

export async function removeSkillFromCharacter(db, characterId, skillId) {
  await db.runAsync('DELETE FROM character_skills WHERE character_id = ? AND skill_id = ?', [characterId, skillId]);
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

export async function addTalent(db, talentData) {
  const query = `
    INSERT INTO talents (
      name, description, icon_url, rank_id, 
      strength_bonus, agility_bonus, vitality_bonus, willpower_bonus, 
      strength_multiplier, agility_multiplier, vitality_multiplier, willpower_multiplier
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
  const params = [
    talentData.name, talentData.description, talentData.icon_url, talentData.rank_id,
    talentData.strength_bonus, talentData.agility_bonus, talentData.vitality_bonus, talentData.willpower_bonus,
    talentData.strength_multiplier, talentData.agility_multiplier, talentData.vitality_multiplier, talentData.willpower_multiplier
  ];
  
  await db.runAsync(query, params);
}

export async function deleteTalent(db, id) {
  await db.runAsync('DELETE FROM talents WHERE id = ?', [id]);
}

export async function getTalentsForCharacter(db, characterId) {
  return db.getAllAsync(`
    SELECT t.* FROM talents t
    JOIN character_talents ct ON t.id = ct.talent_id
    WHERE ct.character_id = ?
  `, [characterId]);
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
