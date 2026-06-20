import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { addLineage } from '../database/crud';

export default function AddLineageScreen({ navigation }) {
  const db = useSQLiteContext();
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="اسم السلالة" 
        value={name}
        onChangeText={setName} 
        style={styles.input} 
      />
      <Button 
        title="حفظ السلالة" 
        onPress={async () => { 
          if (name.trim()) {
            await addLineage(db, name); 
            navigation.goBack(); 
          }
        }} 
        color="#D4AF37" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { backgroundColor: '#FFF', padding: 10, marginBottom: 10, borderRadius: 5 }
});
