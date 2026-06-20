import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllLevels, deleteLevel } from '../database/crud'; // تأكد من إضافة deleteLevel في crud

export default function LevelsListScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [levels, setLevels] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getAllLevels(db);
      setLevels(data);
    })();
  }, [db]));

  return (
    <View className="flex-1 bg-dark-500 p-5">
      <Text className="text-gold-400 text-2xl font-bold mb-5">جدول المستويات</Text>
      <FlatList
        data={levels}
        renderItem={({ item }) => (
          <View className="bg-dark-400 p-4 rounded-lg mb-3 border border-gold-700/20">
            <Text className="text-gold-300 font-bold">مستوى {item.level}</Text>
            <Text className="text-dark-50/60 text-xs">الحد الأدنى للنقاط: {item.min_points}</Text>
            <Text className="text-dark-50/60 text-xs">المضاعف: {item.multiplier}x</Text>
          </View>
        )}
      />
      <Pressable 
        className="bg-gold-500 p-4 rounded-lg items-center"
        onPress={() => navigation.navigate('AddLevel')}>
        <Text className="text-black font-bold">+ إضافة مستوى جديد</Text>
      </Pressable>
    </View>
  );
}

