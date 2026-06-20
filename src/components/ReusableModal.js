// src/components/ReusableModal.js
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

export default function ReusableModal({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>{children}</View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>إغلاق</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '85%', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#D4A017' },
  title: { color: '#D4A017', fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  content: { marginBottom: 20 },
  closeButton: { padding: 10, backgroundColor: '#333', borderRadius: 10, alignItems: 'center' },
  closeText: { color: '#fff' }
});
