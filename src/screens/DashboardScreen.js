import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { getAllCharacters } from '../database/crud';
import { computeFullStats } from '../utils/statCalculator';
import CharacterCard from '../components/CharacterCard';

export default function DashboardScreen({ navigation }) {
  const db = useSQLiteContext();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const rows = await getAllCharacters(db);
          const enriched = rows.map(c => {
            const race = {
              strength_bonus: c.race_str, agility_bonus: c.race_agi,
              intelligence_bonus: c.race_int, vitality_bonus: c.race_vit,
              willpower_bonus: c.race_wil, luck_bonus: c.race_lck,
            };
            const cls = {
              base_health: c.base_health, base_mana: c.base_mana,
              base_attack: c.base_attack, base_defense: c.base_defense,
            };
            const level = {
              health_multiplier: c.health_multiplier, mana_multiplier: c.mana_multiplier,
              attack_multiplier: c.attack_multiplier, defense_multiplier: c.defense_multiplier,
            };
            const { derived } = computeFullStats(c, race, cls, level, [], [], []);
            return { ...c, derived };
          });
          setCharacters(enriched);
        } finally {
          setLoading(false);
        }
      })();
    }, [db])
  );

  if (loading) {
    return (
      <View className="flex-1 bg-dark-500 items-center justify-center">
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark-500">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 bg-dark-400 border-b border-gold-700/20">
        <Text className="text-gold-400 text-2xl font-bold tracking-wide">
          Character Codex
        </Text>
        <Text className="text-dark-50/50 text-xs mt-1">
          Scrolls of the Ancients
        </Text>
      </View>

      {characters.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gold-600 text-lg mb-2">No Characters Yet</Text>
          <Text className="text-dark-50/40 text-sm text-center">
            Create your first warrior to begin the journey through the sands
          </Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <CharacterCard
              character={item}
              derived={item.derived}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => navigation.navigate('Create')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gold-500 items-center justify-center active:bg-gold-600"
        style={{ elevation: 4 }}
      >
        <Text className="text-dark-900 text-2xl font-bold">+</Text>
      </Pressable>
    </View>
  );
}
