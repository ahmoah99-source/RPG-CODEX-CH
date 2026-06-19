import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState, useCallback } from 'react';

// المسارات المصححة بناءً على هيكلة مجلداتك:
import { getFullCharacterData } from '../database/dataService';
import { getAllCharacters } from '../database/crud';
import { useCharacterStats } from '../hooks/useCharacterStats';
import { formatStat } from '../utils/statCalculator';

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
    characterData?.character,
    characterData?.character,
    characterData?.skills || [],
    characterData?.talents || [],
    characterData?.weapons || []
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}>
        <ActivityIndicator color="#D4A017" size="large" />
      </View>
    );
  }

  if (!characterData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 20, marginBottom: 20 }}>لم يتم العثور على بطل بعد!</Text>
        <Pressable 
          onPress={() => navigation.navigate('CreateScreen')} 
          style={{ padding: 15, backgroundColor: '#D4A017', borderRadius: 10 }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold' }}>ابدأ مغامرتك الآن</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 30, marginBottom: 20 }}>{characterData.character.name}</Text>
      
      {statsResult && (
        <View>
          <Text style={{ color: '#fff', fontSize: 18 }}>القوة: {formatStat(statsResult.stats.strength)}</Text>
          <Text style={{ color: '#fff', fontSize: 18 }}>الرشاقة: {formatStat(statsResult.stats.agility)}</Text>
          <Text style={{ color: '#fff', fontSize: 18 }}>الصحة: {formatStat(statsResult.derived.health)}</Text>
        </View>
      )}
    </View>
  );
}
