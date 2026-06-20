// src/screens/DashboardScreen.js
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState, useCallback } from 'react';

// الاستيرادات الأساسية
import { getFullCharacterData } from '../database/dataService';
import { getAllCharacters } from '../database/crud';
import { useCharacterStats } from '../hooks/useCharacterStats';
import { formatStat } from '../utils/statCalculator';

// المكونات المستقلة
import FloatingButton from '../components/FloatingButton';

export default function DashboardScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const characters = await getAllCharacters(db);
        
        if (characters && characters.length > 0) {
          const data = await getFullCharacterData(db, characters[0].id);
          setCharacterData(data);
        } else {
          setCharacterData(null);
        }
        setLoading(false);
      })();
    }, [db])
  );

  const statsResult = useCharacterStats(
    characterData?.character,
    characterData?.character, // افتراض أن العرق جزء من بيانات الشخصية
    characterData?.character, // افتراض أن المستوى جزء من بيانات الشخصية
    characterData?.skills || [],
    characterData?.talents || [],
    characterData?.weapons || []
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#D4A017" size="large" />
      </View>
    );
  }

  if (!characterData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>لم يتم العثور على بطل بعد!</Text>
        <Pressable 
          onPress={() => navigation.navigate('CreateScreen')} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>ابدأ مغامرتك الآن</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{characterData.character.name}</Text>
      
      {statsResult && (
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>القوة: {formatStat(statsResult.stats.strength)}</Text>
          <Text style={styles.statText}>الرشاقة: {formatStat(statsResult.stats.agility)}</Text>
          <Text style={styles.statText}>الصحة: {formatStat(statsResult.derived.health)}</Text>
        </View>
      )}

      {/* الزر العائم المستقل */}
      <FloatingButton onPress={() => navigation.navigate('CreateScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  centerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 30, marginBottom: 20 },
  statsContainer: { gap: 10 },
  statText: { color: '#fff', fontSize: 18 },
  text: { color: '#fff', fontSize: 20, marginBottom: 20 },
  button: { padding: 15, backgroundColor: '#D4A017', borderRadius: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' }
});
