import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addCategory } from '../database/crud';

export default function AddCategoryScreen({ navigation }) {
  const db = useSQLiteContext();
  const [data, setData] = useState({ name: '', description: '', icon_url: '', power_multiplier: '1.0' });

  const handleSave = async () => {
    await addCategory(db, { ...data, power_multiplier: parseFloat(data.power_multiplier) });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="اسم الفئة" onChangeText={(v) => setData({...data, name: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="الوصف" onChangeText={(v) => setData({...data, description: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="رابط الأيقونة" onChangeText={(v) => setData({...data, icon_url: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 10}} />
      <TextInput placeholder="مضاعف القوة" keyboardType="numeric" onChangeText={(v) => setData({...data, power_multiplier: v})} style={{backgroundColor: '#FFF', padding: 10, marginBottom: 20}} />
      <Button title="حفظ الفئة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}
