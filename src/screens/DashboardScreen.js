// src/screens/DashboardScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// الخدمات والمكونات
import { getFullCharacterData } from '../database/dataService';
import { getAllCharacters } from '../database/crud';
import { useCharacterStats } from '../hooks/useCharacterStats';
import StatGrid from '../components/StatGrid';
import FloatingButton from '../components/FloatingButton';
import ReusableModal from '../components/ReusableModal';

export default function DashboardScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // حالات المودال
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const characters = await getAllCharacters(db);
        if (characters?.length > 0) {
          const data = await getFullCharacterData(db, characters[0].id);
          setCharacterData(data);
        } else {
          setCharacterData(null);
        }
        setLoading(false);
      })();
    }, [db])
  );

  const statsResult = useCharacterStats(
    characterData?.character,
    characterData?.character,
    characterData?.character,
    characterData?.skills || [],
    characterData?.talents || [],
    characterData?.weapons || []
  );

  const openDetails = (title, content) => {
    setModalContent(<View style={styles.modalInner}>{content}</View>);
    setModalVisible(true);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#D4A017" size="large" /></View>;

  if (!characterData) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>لم يتم العثور على بطل!</Text>
        <Pressable onPress={() => navigation.navigate('CreateScreen')} style={styles.button}>
          <Text style={styles.buttonText}>إنشاء بطل جديد</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/bg.jpg')} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.name}>{characterData.character.name}</Text>
        <Text style={styles.level}>المستوى: {characterData.character.level}</Text>

        {/* شبكة الإحصائيات التفاعلية */}
        <Text style={styles.sectionTitle}>الإحصائيات</Text>
        <Pressable onPress={() => openDetails('الإحصائيات الكاملة', <StatGrid stats={statsResult.stats} />)}>
          <StatGrid stats={statsResult.stats} />
        </Pressable>

        {/* مناطق المهارات والأسلحة */}
        <View style={styles.gridRow}>
          <Pressable style={styles.box} onPress={() => openDetails('الأسلحة', <Text style={styles.text}>قائمة الأسلحة هنا...</Text>)}>
            <Text style={styles.boxText}>الأسلحة</Text>
          </Pressable>
          <Pressable style={styles.box} onPress={() => openDetails('المهارات', <Text style={styles.text}>قائمة المهارات هنا...</Text>)}>
            <Text style={styles.boxText}>المهارات</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.fabWrapper}>
        <FloatingButton onPress={() => navigation.navigate('CreateScreen')} />
      </View>

      <ReusableModal visible={modalVisible} onClose={() => setModalVisible(false)} title="تفاصيل">
        {modalContent}
      </ReusableModal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  name: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  level: { color: '#D4A017', fontSize: 20, textAlign: 'center', marginBottom: 30 },
  sectionTitle: { color: '#fff', fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  text: { color: '#fff' },
  button: { padding: 15, backgroundColor: '#D4A017', borderRadius: 10 },
  buttonText: { fontWeight: 'bold' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  box: { width: '47%', height: 80, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D4A017' },
  boxText: { color: '#fff', fontWeight: 'bold' },
  fabWrapper: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  modalInner: { padding: 10 }
});
