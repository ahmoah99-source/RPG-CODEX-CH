import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

export default function AddLevelScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [level, setLevel] = useState('');
  const [minPoints, setMinPoints] = useState('');
  const [multiplier, setMultiplier] = useState('');

  async function handleSave() {
    await db.runAsync(
      `INSERT INTO levels (level, min_points, multiplier) VALUES (?, ?, ?)`,
      [parseInt(level), parseFloat(minPoints), parseFloat(multiplier)]
    );
    Alert.alert("نجاح", "تم حفظ المستوى");
    navigation.goBack();
  }

  return (
    <View className="flex-1 bg-dark-500 p-5">
      <Text className="text-gold-400 mb-2">رقم المستوى</Text>
      <TextInput className="bg-dark-400 text-white p-3 mb-4 rounded" keyboardType="numeric" onChangeText={setLevel} />
      <Text className="text-gold-400 mb-2">الحد الأدنى للنقاط</Text>
      <TextInput className="bg-dark-400 text-white p-3 mb-4 rounded" keyboardType="numeric" onChangeText={setMinPoints} />
      <Text className="text-gold-400 mb-2">مضاعف المستوى</Text>
      <TextInput className="bg-dark-400 text-white p-3 mb-4 rounded" keyboardType="numeric" onChangeText={setMultiplier} />
      <Pressable className="bg-gold-500 p-4 rounded items-center" onPress={handleSave}>
        <Text className="font-bold">حفظ المستوى</Text>
      </Pressable>
    </View>
  );
}
