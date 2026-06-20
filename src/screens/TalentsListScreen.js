import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllTalents } from '../database/crud';

export default function TalentsListScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [talents, setTalents] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getAllTalents(db);
      setTalents(data);
    })();
  }, [db]));

  return (
    <View style={{ flex: 1, backgroundColor: '#101018', padding: 20 }}>
      <Text style={{ color: '#D4AF37', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>إدارة المواهب</Text>
      <FlatList
        data={talents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>الرتبة: {item.rank_name}</Text>
            <Text style={{ color: '#777', fontSize: 12 }}>{item.description}</Text>
          </View>
        )}
      />
      <Pressable 
        style={{ backgroundColor: '#D4AF37', padding: 15, borderRadius: 10, alignItems: 'center' }}
        onPress={() => navigation.navigate('AddTalent')}>
        <Text style={{ fontWeight: 'bold' }}>+ إضافة موهبة جديدة</Text>
      </Pressable>
    </View>
  );
}
