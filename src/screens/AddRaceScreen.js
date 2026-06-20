import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addRace, getAllLineages } from '../database/crud';

export default function AddRaceScreen({ navigation }) {
  const db = useSQLiteContext();
  const [lineages, setLineages] = useState([]);
  const [r, setR] = useState({ name: '', lineage_id: null, strength: 0, agility: 0, vitality: 0, willpower: 0, desc: '' });

  useEffect(() => { getAllLineages(db).then(setLineages); }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="اسم العرق" onChangeText={(v) => setR({...r, name: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      
      <Text>السلالة الرئيسية:</Text>
      {lineages.map(l => (
        <Pressable key={l.id} onPress={() => setR({...r, lineage_id: l.id})} style={{backgroundColor: r.lineage_id === l.id ? '#D4AF37' : '#CCC', padding: 10, margin: 5}}>
          <Text>{l.name}</Text>
        </Pressable>
      ))}

      {/* مثال لزيادة القوة مع أزرار */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
        <Button title="-" onPress={() => setR({...r, strength: r.strength - 1})} />
        <Text style={{marginHorizontal: 10}}>زيادة القوة: {r.strength}</Text>
        <Button title="+" onPress={() => setR({...r, strength: r.strength + 1})} />
      </View>

      <TextInput placeholder="الوصف" onChangeText={(v) => setR({...r, desc: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <Button title="حفظ العرق" onPress={async () => { await addRace(db, r); navigation.goBack(); }} color="#D4AF37" />
    </ScrollView>
  );
}

