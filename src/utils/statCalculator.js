/**
 * Character Codex – Stat Calculation Engine
 * All formulas are pure functions with no side effects.
 */

// ─── Formatters ──────────────────────────────────────────────

export function formatStat(value) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${Math.round(abs)}`;
}

// ─── Stat Names ──────────────────────────────────────────────

const STAT_KEYS = ['strength', 'agility', 'intelligence', 'vitality', 'willpower', 'luck'];

export { STAT_KEYS };

// ─── Core Stat Calculation ───────────────────────────────────
// Formula: (Base + Race Bonus + Skills + Talents + Weapons) * (1 + Talent Multipliers)

export function calculateStats(character, race, skills, talents, weapons) {
  const stats = {};

  // Accumulate flat bonuses
  const flatBonus = {};
  for (const key of STAT_KEYS) {
    flatBonus[key] = (race?.[`${key}_bonus`] ?? 0);
  }

  // Skills
  for (const skill of skills) {
    for (const key of STAT_KEYS) {
      flatBonus[key] += skill?.[`${key}_bonus`] ?? 0;
    }
  }

  // Talents (flat bonuses)
  for (const talent of talents) {
    for (const key of STAT_KEYS) {
      flatBonus[key] += talent?.[`${key}_bonus`] ?? 0;
    }
  }

  // Weapons (flat bonuses for strength/agility)
  const equippedWeapon = weapons?.find(w => w.is_equipped) ?? null;
  if (equippedWeapon) {
    flatBonus.strength += equippedWeapon.strength_bonus ?? 0;
    flatBonus.agility += equippedWeapon.agility_bonus ?? 0;
  }

  // Talent multipliers
  const multiplierBonus = {};
  for (const key of STAT_KEYS) {
    multiplierBonus[key] = 0;
  }
  for (const talent of talents) {
    for (const key of STAT_KEYS) {
      multiplierBonus[key] += talent?.[`${key}_multiplier`] ?? 0;
    }
  }

  // Final stat: (base + flatBonus) * (1 + multiplier)
  for (const key of STAT_KEYS) {
    const base = character?.[`base_${key}`] ?? 10;
    stats[key] = Math.floor((base + flatBonus[key]) * (1 + multiplierBonus[key]));
  }

  // ─── Agility Penalty ──────────────────────────────────────
  // If equipped weapon weight > 2 * Strength, apply penalty:
  // Final Agility = Agility - ((WeaponWeight - (Strength * 2)) / 20)
  if (equippedWeapon && equippedWeapon.weight > 2 * stats.strength) {
    const penalty = (equippedWeapon.weight - stats.strength * 2) / 20;
    stats.agility = Math.floor(stats.agility - penalty);
  }

  return stats;
}

// ─── Derived Stats ───────────────────────────────────────────
// Health, Mana, Attack Power, Defense using Level Multipliers

export function calculateDerivedStats(stats, characterClass, level) {
  const hm = level?.health_multiplier ?? 1;
  const mm = level?.mana_multiplier ?? 1;
  const am = level?.attack_multiplier ?? 1;
  const dm = level?.defense_multiplier ?? 1;

  const baseHealth = characterClass?.base_health ?? 100;
  const baseMana = characterClass?.base_mana ?? 50;
  const baseAttack = characterClass?.base_attack ?? 10;
  const baseDefense = characterClass?.base_defense ?? 5;

  const health = Math.floor((baseHealth + stats.vitality * 5) * hm);
  const mana = Math.floor((baseMana + stats.intelligence * 4 + stats.willpower * 2) * mm);
  const attackPower = Math.floor((baseAttack + stats.strength * 3 + stats.agility) * am);
  const defense = Math.floor((baseDefense + stats.vitality * 2 + stats.willpower) * dm);

  return { health, mana, attackPower, defense };
}

// ─── Convenience: Full Character Computation ────────────────

export function computeFullStats(character, race, characterClass, level, skills, talents, weapons) {
  const stats = calculateStats(character, race, skills, talents, weapons);
  const derived = calculateDerivedStats(stats, characterClass, level);
  return { stats, derived };
}
