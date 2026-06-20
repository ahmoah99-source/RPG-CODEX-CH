// --- Talents ---
export async function addTalent(db, data) {
  await db.runAsync(
    `INSERT INTO talents (name, description, icon_url, rank_id, strength_bonus, agility_bonus, vitality_bonus, willpower_bonus, strength_multiplier, agility_multiplier, vitality_multiplier, willpower_multiplier) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.description, data.icon_url, data.rank_id, data.strength_bonus, data.agility_bonus, data.vitality_bonus, data.willpower_bonus, data.strength_multiplier, data.agility_multiplier, data.vitality_multiplier, data.willpower_multiplier]
  );
}

// --- Categories ---
export async function addCategory(db, data) {
  await db.runAsync('INSERT INTO categories (name, description, icon_url, power_multiplier) VALUES (?, ?, ?, ?)', 
  [data.name, data.description, data.icon_url, data.power_multiplier]);
}

// --- Skills ---
export async function addSkill(db, s) {
  await db.runAsync(
    `INSERT INTO skills (name, category_id, description, icon_url, type, damage_multiplier, mana_cost, strength_bonus, agility_bonus, intelligence_bonus, vitality_bonus, willpower_bonus, luck_bonus) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [s.name, s.category_id, s.description, s.icon_url, s.type, s.damage_multiplier, s.mana_cost, s.strength_bonus, s.agility_bonus, s.intelligence_bonus, s.vitality_bonus, s.willpower_bonus, s.luck_bonus]
  );
}

export async function getAllCategories(db) {
  return await db.getAllAsync('SELECT * FROM categories ORDER BY name');
}

export async function getAllSkills(db) {
  return await db.getAllAsync(`
    SELECT s.*, c.name as category_name, c.power_multiplier as cat_multiplier 
    FROM skills s 
    LEFT JOIN categories c ON s.category_id = c.id 
    ORDER BY s.name
  `);
}
