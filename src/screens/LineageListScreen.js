import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllLineages, deleteLineage } from '../database/crud';

export default function LineageListScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [lineages, setLineages] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getAllLineages(db);
        setLineages(data);
      })();
    }, [db])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إدارة السلالات</Text>
      
      <FlatList
        data={lineages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.name}</Text>
            <Pressable onPress={async () => { await deleteLineage(db, item.id); /* تحديث القائمة */ }}>
              <Text style={{color: 'red'}}>حذف</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('AddLineage')}>
        <Text style={styles.buttonText}>+ إضافة سلالة جديدة</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101018', padding: 20 },
  title: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { backgroundColor: '#1E1E26', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  text: { color: '#FFF', fontSize: 18 },
  button: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#000', fontWeight: 'bold' }
});

