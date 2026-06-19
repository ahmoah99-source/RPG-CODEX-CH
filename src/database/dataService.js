// src/database/dataService.js

export async function getFullCharacterData(db, characterId) {
  try {
    // 1. جلب بيانات الشخصية مع العرق والفئة والمستوى (استعلام واحد شامل)
    const character = await getCharacterById(db, characterId);
    
    // 2. جلب المهارات (باستخدام الدالة الموجودة في crud.js)
    const skills = await getSkillsForCharacter(db, characterId);

    // 3. جلب المواهب
    const talents = await getTalentsForCharacter(db, characterId);

    // 4. جلب الأسلحة
    const weapons = await getWeaponsForCharacter(db, characterId);

    // إرجاع كائن متكامل
    return {
      character, // يحتوي على (race, class, level info) من استعلام getCharacterById
      skills,
      talents,
      weapons
    };
  } catch (error) {
    console.error("Error fetching full character data:", error);
    return null;
  }
}

