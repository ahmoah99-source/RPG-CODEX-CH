/**
 * Character Codex – Stat Calculation Engine (Unified Human Standard 1.1)
 * متوافق تماماً مع معادلات AppSheet الأصلية
 */

export function formatStat(value) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)} B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)} M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)} K`;
  return `${sign}${Math.round(abs)}`;
}

// الإحصائيات الأربعة الأساسية فقط
export const STAT_KEYS = ['strength', 'agility', 'vitality', 'willpower'];

export function calculateStats(character, race, skills, talents, weapons) {
  const stats = {};

  for (const key of STAT_KEYS) {
    // 1. الأساس + العرق + المهارات + المواهب + الأسلحة (Flat Bonuses)
    const base = character?.[`base_${key}`] ?? 0;
    const raceBonus = race?.[`${key}_bonus`] ?? 0;
    
    const skillBonus = skills.reduce((sum, s) => sum + (s?.[`${key}_bonus`] ?? 0), 0);
    const talentBonus = talents.reduce((sum, t) => sum + (t?.[`${key}_bonus`] ?? 0), 0);
    const weaponBonus = weapons.reduce((sum, w) => sum + (w?.[`${key}_bonus`] ?? 0), 0);

    const flatTotal = base + raceBonus + skillBonus + talentBonus + weaponBonus;

    // 2. المضاعف (معامل المواهب)
    const multiplier = talents.reduce((sum, t) => sum + (t?.[`${key}_multiplier`] ?? 0), 0);

    // 3. النتيجة النهائية: (الأساس + الإضافات) * (1 + المعامل)
    stats[key] = Math.floor(flatTotal * (1 + multiplier));
  }

  // الرشاقة النهائية (Agility Penalty) - مطابقة لمعادلتك
  const equippedWeapon = weapons?.find(w => w.is_equipped) ?? null;
  if (equippedWeapon) {
    const penaltyThreshold = stats.strength * 2;
    if (equippedWeapon.weight > penaltyThreshold) {
      const penalty = (equippedWeapon.weight - penaltyThreshold) / 20;
      stats.agility = Math.floor(stats.agility - penalty);
    }
  }

  return stats;
}

export function calculateDerivedStats(stats, level, weapons) {
  const lm = level?.multiplier ?? 1; // مضاعف المستوى
  
  // الصحة: (الجسد * 50) * مضاعف المستوى
  const health = Math.floor((stats.vitality * 50) * lm);
  
  // المانا: (الروح * 20) * مضاعف المستوى
  const mana = Math.floor((stats.willpower * 20) * lm);
  
  // قوة الهجوم: مطابقة لمعادلتك المعقدة
  const equippedWeapon = weapons?.find(w => w.is_equipped);
  const weaponMult = equippedWeapon ? equippedWeapon.damage_multiplier : 1;
  const attackPower = Math.floor(((stats.strength + stats.vitality) * stats.agility * stats.willpower * 5) * lm * weaponMult);

  // الدفاع: ((الجسد * 2) + الرشاقة) * مضاعف المستوى
  const defense = Math.floor(((stats.vitality * 2) + stats.agility) * lm);

  return { health, mana, attackPower, defense };
}

export function computeFullStats(character, race, level, skills, talents, weapons) {
  const stats = calculateStats(character, race, skills, talents, weapons);
  const derived = calculateDerivedStats(stats, level, weapons);
  return { stats, derived };
}
