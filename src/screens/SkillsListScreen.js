import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { getAllSkills } from '../database/crud';

export default function SkillsListScreen({ navigation }) {
  const db = useSQLiteContext();
  const [skills, setSkills] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getAllSkills(db).then(setSkills);
    }, [db])
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: '#D4AF37', fontSize: 24, marginBottom: 20 }}>المهارات</Text>
      <FlatList
        data={skills}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#FFF', fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: '#D4AF37' }}>الفئة: {item.category_name || 'بدون فئة'}</Text>
          </View>
        )}
      />
      <Pressable onPress={() => navigation.navigate('AddSkill')} style={{ backgroundColor: '#D4AF37', padding: 15, borderRadius: 10 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>إضافة مهارة جديدة</Text>
      </Pressable>
    </View>
  );
}

