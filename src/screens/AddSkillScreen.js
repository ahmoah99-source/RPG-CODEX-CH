import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addSkill, getAllCategories } from '../database/crud';

export default function AddSkillScreen({ navigation }) {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState([]);
  const [skill, setSkill] = useState({ name: '', category_id: null, description: '', type: '', damage_multiplier: '1', mana_cost: '0' });

  useEffect(() => {
    getAllCategories(db).then(setCategories);
  }, []);

  const handleSave = async () => {
    await addSkill(db, skill);
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="اسم المهارة" onChangeText={(v) => setSkill({...skill, name: v})} style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 10 }} />
      
      <Text style={{ color: '#D4AF37', marginBottom: 10 }}>اختر الفئة (اختياري):</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        <Pressable onPress={() => setSkill({...skill, category_id: null})} style={{ padding: 10, backgroundColor: skill.category_id === null ? '#D4AF37' : '#333', margin: 2 }}>
          <Text style={{ color: '#FFF' }}>بدون فئة</Text>
        </Pressable>
        {categories.map(cat => (
          <Pressable key={cat.id} onPress={() => setSkill({...skill, category_id: cat.id})} style={{ padding: 10, backgroundColor: skill.category_id === cat.id ? '#D4AF37' : '#333', margin: 2 }}>
            <Text style={{ color: '#FFF' }}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput placeholder="نوع المهارة" onChangeText={(v) => setSkill({...skill, type: v})} style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 10 }} />
      <TextInput placeholder="مضاعف الضرر" keyboardType="numeric" onChangeText={(v) => setSkill({...skill, damage_multiplier: v})} style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 10 }} />
      <Button title="حفظ المهارة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}

