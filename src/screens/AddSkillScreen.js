import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addSkill, getAllCategories } from '../database/crud';

export default function AddSkillScreen({ navigation }) {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState([]);
  const [s, setS] = useState({ 
    name: '', category_id: null, description: '', icon_url: '', type: '', 
    damage_multiplier: '1', mana_cost: '0', strength_bonus: '0', agility_bonus: '0', 
    intelligence_bonus: '0', vitality_bonus: '0', willpower_bonus: '0', luck_bonus: '0' 
  });

  useEffect(() => { getAllCategories(db).then(setCategories); }, []);

  const handleSave = async () => {
    await addSkill(db, s);
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="اسم المهارة" onChangeText={(v) => setS({...s, name: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="الوصف" onChangeText={(v) => setS({...s, description: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="رابط الأيقونة" onChangeText={(v) => setS({...s, icon_url: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="النوع (Active/Passive)" onChangeText={(v) => setS({...s, type: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="مضاعف الضرر" keyboardType="numeric" onChangeText={(v) => setS({...s, damage_multiplier: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="استهلاك المانا" keyboardType="numeric" onChangeText={(v) => setS({...s, mana_cost: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      {/* يمكن إضافة باقي الـ Bonus بنفس الطريقة */}
      <Button title="حفظ المهارة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}
