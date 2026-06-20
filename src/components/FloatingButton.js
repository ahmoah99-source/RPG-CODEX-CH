// src/components/FloatingButton.js
import { Pressable, Text, StyleSheet } from 'react-native';

export default function FloatingButton({ onPress }) {
  return (
    <Pressable 
      onPress={onPress}
      style={styles.fab}
    >
      <Text style={styles.text}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4A017',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  }
});

