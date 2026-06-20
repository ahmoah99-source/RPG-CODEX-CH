import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllRaces } from '../database/crud';

export default function RacesListScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [races, setRaces] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getAllRaces(db);
        setRaces(data);
      })();
    }, [db])
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#101018', padding: 20 }}>
      <Text style={{ color: '#D4AF37', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>إدارة الأعراق</Text>
      
      <FlatList
        data={races}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: '#D4AF37', fontSize: 14 }}>السلالة: {item.lineage_name || 'غير محددة'}</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>الوصف: {item.description}</Text>
            <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
              <Text style={{ color: '#777', fontSize: 11 }}>قوة: {item.strength_bonus}</Text>
              <Text style={{ color: '#777', fontSize: 11 }}>رشاقة: {item.agility_bonus}</Text>
              <Text style={{ color: '#777', fontSize: 11 }}>جسد: {item.vitality_bonus}</Text>
              <Text style={{ color: '#777', fontSize: 11 }}>روح: {item.willpower_bonus}</Text>
            </View>
          </View>
        )}
      />

      <Pressable 
        style={{ backgroundColor: '#D4AF37', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }}
        onPress={() => navigation.navigate('AddRace')}>
        <Text style={{ color: '#000', fontWeight: 'bold' }}>+ إضافة عرق جديد</Text>
      </Pressable>
      
      <Pressable 
        style={{ backgroundColor: '#333', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
        onPress={() => navigation.navigate('AddLineage')}>
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+ إضافة سلالة جديدة</Text>
      </Pressable>
    </View>
  );
}
