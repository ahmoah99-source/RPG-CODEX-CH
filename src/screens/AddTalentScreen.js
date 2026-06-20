import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addTalent, getAllRanks } from '../database/crud';
import { useNavigation } from '@react-navigation/native';

export default function AddTalentScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [ranks, setRanks] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', rank_id: null,
    str_bonus: '0', agi_bonus: '0', vit_bonus: '0', wil_bonus: '0',
    str_mult: '0', agi_mult: '0', vit_mult: '0', wil_mult: '0'
  });

  useEffect(() => {
    (async () => {
      const allRanks = await getAllRanks(db);
      setRanks(allRanks);
    })();
  }, []);

  const handleSave = async () => {
    if (!formData.rank_id) { alert("يجب اختيار رتبة!"); return; }
    await addTalent(db, { ...formData });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#101018' }}>
      <TextInput placeholder="اسم الموهبة" onChangeText={(v) => setFormData({...formData, name: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      
      <Text style={{color: '#D4AF37', marginBottom: 5}}>اختر الرتبة:</Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
        {ranks.map((rank) => (
          <Pressable 
            key={rank.id} 
            onPress={() => setFormData({...formData, rank_id: rank.id})}
            style={{backgroundColor: formData.rank_id === rank.id ? '#D4AF37' : '#333', padding: 10, margin: 2, borderRadius: 5}}>
            <Text style={{color: '#FFF'}}>{rank.name}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput placeholder="الوصف" onChangeText={(v) => setFormData({...formData, description: v})} style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} />
      
      {/* باقي حقول الـ Bonus و Multipliers كما كانت */}
      <TextInput placeholder="قوة (Bonus)" onChangeText={(v) => setFormData({...formData, str_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 5}} />
      <TextInput placeholder="معامل القوة (Multiplier)" onChangeText={(v) => setFormData({...formData, str_mult: v})} style={{backgroundColor: '#FFF', marginBottom: 5}} />

      <Button title="حفظ الموهبة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}
