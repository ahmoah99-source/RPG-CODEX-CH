import { useMemo } from 'react';
import { computeFullStats } from '../utils/statCalculator';

/**
 * Hook يقوم بربط بيانات الشخصية بمحرك الحسابات
 * ويقوم بتحديث النتائج فقط إذا تغيرت البيانات المدخلة
 */
export function useCharacterStats(character, race, level, skills, talents, weapons) {
  return useMemo(() => {
    // إذا لم تكن الشخصية موجودة، نرجع null لتجنب الأخطاء
    if (!character) return null;

    // استدعاء المحرك الذي اتفقنا عليه
    return computeFullStats(character, race, level, skills, talents, weapons);
  }, [character, race, level, skills, talents, weapons]); // لا يعيد الحساب إلا إذا تغير أحد هذه المدخلات
}
