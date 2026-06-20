import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRanks, addRank } from '../database/crud';

export default function RanksListScreen() {
  const db = useSQLiteContext();
  const [ranks, setRanks] = useState([]);
  const [newRank, setNewRank] = useState({ name: '', icon_url: '' });

  const loadRanks = useCallback(async () => {
    const data = await getAllRanks(db);
    setRanks(data);
  }, [db]);

  useFocusEffect(loadRanks);

  const handleAddRank = async () => {
    if (!newRank.name) return;
    await addRank(db, newRank);
    setNewRank({ name: '', icon_url: '' });
    loadRanks();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#101018', padding: 20 }}>
      <Text style={{ color: '#D4AF37', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>إدارة الرتب</Text>
      <View style={{ marginBottom: 20 }}>
        <TextInput placeholder="اسم الرتبة" value={newRank.name} onChangeText={(v) => setNewRank({...newRank, name: v})} style={{backgroundColor: '#FFF', padding: 10, borderRadius: 5, marginBottom: 5}} />
        <TextInput placeholder="رابط الأيقونة" value={newRank.icon_url} onChangeText={(v) => setNewRank({...newRank, icon_url: v})} style={{backgroundColor: '#FFF', padding: 10, borderRadius: 5, marginBottom: 5}} />
        <Pressable onPress={handleAddRank} style={{backgroundColor: '#D4AF37', padding: 10, alignItems: 'center', borderRadius: 5}}>
          <Text style={{fontWeight: 'bold'}}>إضافة رتبة</Text>
        </Pressable>
      </View>
      <FlatList
        data={ranks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#FFF', fontSize: 18 }}>الرتبة: {item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
