import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getAllRaces, getAllClasses, createCharacter } from '../database/crud';

export default function CreateScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [baseStats, setBaseStats] = useState({
    strength: 10, agility: 10, intelligence: 10,
    vitality: 10, willpower: 10, luck: 10,
  });

  useEffect(() => {
    (async () => {
      setRaces(await getAllRaces(db));
      setClasses(await getAllClasses(db));
      setLoading(false);
    })();
  }, [db]);

  if (loading) {
    return (
      <View className="flex-1 bg-dark-500 items-center justify-center">
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Every warrior needs a name.');
      return;
    }
    if (!selectedRace) {
      Alert.alert('Select Race', 'Choose a bloodline for your character.');
      return;
    }
    if (!selectedClass) {
      Alert.alert('Select Class', 'Choose a discipline for your character.');
      return;
    }

    const charId = await createCharacter(db, {
      name: name.trim(),
      race_id: selectedRace,
      class_id: selectedClass,
      ...baseStats,
    });
    navigation.replace('Detail', { id: charId });
  }

  function adjustStat(key, delta) {
    setBaseStats(prev => ({
      ...prev,
      [key]: Math.max(1, Math.min(30, prev[key] + delta)),
    }));
  }

  return (
    <ScrollView className="flex-1 bg-dark-500" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-5 pt-14 pb-4 bg-dark-400 border-b border-gold-700/20">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-gold-400 text-sm">&larr; Cancel</Text>
        </Pressable>
        <Text className="text-gold-400 text-xl font-bold mt-3">New Character</Text>
      </View>

      {/* Name */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-2 tracking-wider uppercase">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter character name..."
          placeholderTextColor="#9A9080"
          className="bg-dark-400 border border-gold-700/30 rounded-lg px-4 py-3 text-gold-300 text-sm"
        />
      </View>

      {/* Race */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-2 tracking-wider uppercase">Race</Text>
        <View className="flex-row flex-wrap gap-2">
          {races.map(r => (
            <Pressable
              key={r.id}
              onPress={() => setSelectedRace(r.id)}
              className={`px-3 py-2 rounded-lg border ${
                selectedRace === r.id
                  ? 'bg-gold-500/20 border-gold-500'
                  : 'bg-dark-400 border-gold-700/20'
              }`}
            >
              <Text className={`text-sm ${selectedRace === r.id ? 'text-gold-400' : 'text-dark-50/60'}`}>
                {r.name}
              </Text>
            </Pressable>
          ))}
        </View>
        {selectedRace && (() => {
          const r = races.find(x => x.id === selectedRace);
          return (
            <Text className="text-dark-50/40 text-xs mt-2">{r.description}</Text>
          );
        })()}
      </View>

      {/* Class */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-2 tracking-wider uppercase">Class</Text>
        <View className="flex-row flex-wrap gap-2">
          {classes.map(c => (
            <Pressable
              key={c.id}
              onPress={() => setSelectedClass(c.id)}
              className={`px-3 py-2 rounded-lg border ${
                selectedClass === c.id
                  ? 'bg-gold-500/20 border-gold-500'
                  : 'bg-dark-400 border-gold-700/20'
              }`}
            >
              <Text className={`text-sm ${selectedClass === c.id ? 'text-gold-400' : 'text-dark-50/60'}`}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>
        {selectedClass && (() => {
          const c = classes.find(x => x.id === selectedClass);
          return (
            <Text className="text-dark-50/40 text-xs mt-2">{c.description}</Text>
          );
        })()}
      </View>

      {/* Base Stats */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Base Stats (1–30)
        </Text>
        {Object.entries(baseStats).map(([key, val]) => (
          <View key={key} className="flex-row items-center justify-between mb-2">
            <Text className="text-dark-50/60 text-sm uppercase w-24">{key}</Text>
            <View className="flex-row items-center gap-4">
              <Pressable
                className="w-8 h-8 rounded bg-dark-400 border border-gold-700/20 items-center justify-center"
                onPress={() => adjustStat(key, -1)}
              >
                <Text className="text-gold-400">-</Text>
              </Pressable>
              <Text className="text-gold-400 text-lg font-bold w-8 text-center">{val}</Text>
              <Pressable
                className="w-8 h-8 rounded bg-dark-400 border border-gold-700/20 items-center justify-center"
                onPress={() => adjustStat(key, 1)}
              >
                <Text className="text-gold-400">+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Create Button */}
      <View className="px-5 mt-8">
        <Pressable
          className="bg-gold-500 rounded-lg py-4 items-center active:bg-gold-600"
          onPress={handleCreate}
        >
          <Text className="text-dark-900 text-base font-bold">Forge Character</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
