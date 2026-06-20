import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addTalent, getAllRanks } from '../database/crud';
import { useNavigation } from '@react-navigation/native';

export default function AddTalentScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [ranks, setRanks] = useState([]);
  
  // بيانات الموهبة
  const [formData, setFormData] = useState({
    name: '', description: '', rank_id: '',
    str_bonus: '0', agi_bonus: '0', vit_bonus: '0', wil_bonus: '0',
    str_mult: '0', agi_mult: '0', vit_mult: '0', wil_mult: '0'
  });

  useEffect(() => {
    (async () => {
      const allRanks = await getAllRanks(db);
      setRanks(allRanks);
    })();
  }, [db]);

  const handleSave = async () => {
    await addTalent(db, {
      name: formData.name,
      description: formData.description,
      rank_id: formData.rank_id,
      strength_bonus: parseInt(formData.str_bonus),
      agility_bonus: parseInt(formData.agi_bonus),
      vitality_bonus: parseInt(formData.vit_bonus),
      willpower_bonus: parseInt(formData.wil_bonus),
      strength_multiplier: parseFloat(formData.str_mult),
      agility_multiplier: parseFloat(formData.agi_mult),
      vitality_multiplier: parseFloat(formData.vit_mult),
      willpower_multiplier: parseFloat(formData.wil_mult)
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#101018' }}>
      <TextInput placeholder="اسم الموهبة" onChangeText={(v) => setFormData({...formData, name: v})} style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} />
      <TextInput placeholder="الوصف" onChangeText={(v) => setFormData({...formData, description: v})} style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} />
      
      {/* هنا ستحتاج لاختيار الرتبة (Rank) من قائمة Ranks */}
      <Text style={{color: '#FFF'}}>اختر الرتبة (اكتب الـ ID مؤقتاً):</Text>
      <TextInput placeholder="Rank ID" onChangeText={(v) => setFormData({...formData, rank_id: v})} style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} />

      <Text style={{color: '#D4AF37'}}>زيادات ثابتة (Bonus):</Text>
      <TextInput placeholder="قوة" onChangeText={(v) => setFormData({...formData, str_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 5}} />
      
      <Text style={{color: '#D4AF37'}}>معاملات (Multipliers):</Text>
      <TextInput placeholder="معامل القوة (مثال 0.5)" onChangeText={(v) => setFormData({...formData, str_mult: v})} style={{backgroundColor: '#FFF', marginBottom: 5}} />

      <Button title="حفظ الموهبة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}
