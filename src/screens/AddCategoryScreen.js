import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addCategory } from '../database/crud';

export default function AddCategoryScreen({ navigation }) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [multiplier, setMultiplier] = useState('0');

  const handleSave = async () => {
    await addCategory(db, { name, description: desc, icon_url: '', power_multiplier: parseFloat(multiplier) });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput placeholder="اسم الفئة" value={name} onChangeText={setName} style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 10, borderRadius: 5 }} />
      <TextInput placeholder="الوصف" value={desc} onChangeText={setDesc} style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 10, borderRadius: 5 }} />
      <TextInput placeholder="مضاعف القوة" value={multiplier} onChangeText={setMultiplier} keyboardType="numeric" style={{ backgroundColor: '#FFF', padding: 10, marginBottom: 20, borderRadius: 5 }} />
      <Button title="حفظ الفئة" onPress={handleSave} color="#D4AF37" />
    </ScrollView>
  );
}

