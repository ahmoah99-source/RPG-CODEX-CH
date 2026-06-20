import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addTalent, getAllRanks } from '../database/crud';
import { useNavigation } from '@react-navigation/native';

export default function AddTalentScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [ranks, setRanks] = useState([]);
  
  // توسيع الـ State لتشمل كل حقولك الأصلية بالتفصيل
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    icon_url: '', 
    rank_id: null,
    strength_bonus: '0', 
    agility_bonus: '0', 
    vitality_bonus: '0', 
    willpower_bonus: '0',
    strength_multiplier: '0', 
    agility_multiplier: '0', 
    vitality_multiplier: '0', 
    willpower_multiplier: '0'
  });

  useEffect(() => {
    (async () => {
      const allRanks = await getAllRanks(db);
      setRanks(allRanks);
    })();
  }, []);

  const handleSave = async () => {
    if (!formData.rank_id) { 
      alert("يجب اختيار رتبة!"); 
      return; 
    }
    await addTalent(db, { ...formData });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#101018' }}>
      <TextInput 
        placeholder="اسم الموهبة" 
        onChangeText={(v) => setFormData({...formData, name: v})} 
        style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} 
      />
      
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

      <TextInput 
        placeholder="الوصف" 
        onChangeText={(v) => setFormData({...formData, description: v})} 
        style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} 
      />
      
      <TextInput 
        placeholder="رابط الأيقونة" 
        onChangeText={(v) => setFormData({...formData, icon_url: v})} 
        style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} 
      />

      <Text style={{color: '#D4AF37', marginTop: 10}}>الإحصائيات (Bonus):</Text>
      <TextInput placeholder="قوة (Bonus)" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, strength_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="رشاقة (Bonus)" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, agility_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="حيوية (Bonus)" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, vitality_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="إرادة (Bonus)" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, willpower_bonus: v})} style={{backgroundColor: '#FFF', marginBottom: 10, padding: 10}} />

      <Text style={{color: '#D4AF37', marginTop: 10}}>المضاعفات (Multipliers):</Text>
      <TextInput placeholder="معامل القوة" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, strength_multiplier: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="معامل الرشاقة" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, agility_multiplier: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="معامل الحيوية" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, vitality_multiplier: v})} style={{backgroundColor: '#FFF', marginBottom: 5, padding: 10}} />
      <TextInput placeholder="معامل الإرادة" keyboardType="numeric" onChangeText={(v) => setFormData({...formData, willpower_multiplier: v})} style={{backgroundColor: '#FFF', marginBottom: 20, padding: 10}} />

      <Button title="حفظ الموهبة" onPress={handleSave} color="#D4AF37" />
      <View style={{height: 50}} />
    </ScrollView>
  );
}
