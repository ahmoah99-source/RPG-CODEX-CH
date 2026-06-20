import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { getAllCategories } from '../database/crud';

export default function CategoriesListScreen({ navigation }) {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getAllCategories(db).then(setCategories);
    }, [db])
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: '#D4AF37', fontSize: 24, marginBottom: 20 }}>الفئات</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ color: '#FFF', fontSize: 18 }}>{item.name}</Text>
          </View>
        )}
      />
      <Pressable onPress={() => navigation.navigate('AddCategory')} style={{ backgroundColor: '#D4AF37', padding: 15, borderRadius: 10 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>إضافة فئة جديدة</Text>
      </Pressable>
    </View>
  );
}
