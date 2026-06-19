import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { useCharacterStats } from '../hooks/useCharacterStats';
import { formatStat } from '../utils/statCalculator';

export default function DashboardScreen({ navigation }) {
  const db = useSQLiteContext();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب البيانات (سأفترض أنك ستجلب المتغيرات من قاعدة البيانات لاحقاً)
  // الآن سنستخدم القيم الافتراضية للربط
  const statsResult = useCharacterStats(character, {}, {}, [], [], []);

  useFocusEffect(
    useCallback(() => {
      // هنا ستضع كود جلب الشخصية من الـ SQLite
      setLoading(false);
    }, [db])
  );

  if (loading) return <View style={{flex: 1, backgroundColor: '#000'}}><ActivityIndicator color="#D4A017" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' }}>
      
      {/* اسم البطل */}
      <Text style={{ color: '#fff', fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 }}>
        {character?.name || 'Unknown Hero'}
      </Text>

      {/* منطقة الأرقام (التي تظهر كأنها تطفو) */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 30 }}>
        {statsResult && (
          <>
            <StatItem label="STR" value={formatStat(statsResult.stats.strength)} />
            <StatItem label="AGI" value={formatStat(statsResult.stats.agility)} />
            <StatItem label="VIT" value={formatStat(statsResult.stats.vitality)} />
            <StatItem label="WIL" value={formatStat(statsResult.stats.willpower)} />
            <StatItem label="HP" value={formatStat(statsResult.derived.health)} />
            <StatItem label="ATK" value={formatStat(statsResult.derived.attackPower)} />
          </>
        )}
      </View>

      {/* زر الـ Action Hub الدائري */}
      <Pressable 
        style={{ 
          position: 'absolute', bottom: 60, alignSelf: 'center',
          width: 70, height: 70, borderRadius: 35,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          justifyContent: 'center', alignItems: 'center',
          borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)'
        }}
        onPress={() => console.log('Action Hub Opened')}
      >
        <Text style={{ color: '#fff', fontSize: 30 }}>+</Text>
      </Pressable>
    </View>
  );
}

// مكون فرعي لعرض الإحصائية (ليكون الكود نظيفاً)
function StatItem({ label, value }) {
  return (
    <View style={{ alignItems: 'center', width: '40%' }}>
      <Text style={{ color: '#aaa', fontSize: 12 }}>{label}</Text>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}
