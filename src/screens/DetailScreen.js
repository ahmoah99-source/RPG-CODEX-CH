import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
  getCharacterById, getSkillsForCharacter, getTalentsForCharacter,
  getWeaponsForCharacter, deleteCharacter, removeSkillFromCharacter,
  removeTalentFromCharacter, removeWeaponFromCharacter, addSkillToCharacter,
  addTalentToCharacter, addWeaponToCharacter, equipWeapon,
} from '../database/crud';
import { computeFullStats, formatStat } from '../utils/statCalculator';
import StatGrid from '../components/StatGrid';
import ProgressBar from '../components/ProgressBar';

export default function DetailScreen() {
  const db = useSQLiteContext();
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [character, setCharacter] = useState(null);
  const [computed, setComputed] = useState(null);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const c = await getCharacterById(db, id);
      if (!c) { navigation.goBack(); return; }
      setCharacter(c);

      const sk = await getSkillsForCharacter(db, id);
      const ta = await getTalentsForCharacter(db, id);
      const wp = await getWeaponsForCharacter(db, id);
      setSkills(sk);
      setTalents(ta);
      setWeapons(wp);

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
      setComputed(computeFullStats(c, race, cls, level, sk, ta, wp));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  if (loading || !character || !computed) {
    return (
      <View className="flex-1 bg-dark-500 items-center justify-center">
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  const { stats, derived } = computed;

  function confirmDelete() {
    Alert.alert('Delete Character', `Remove ${character.name} from the Codex?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteCharacter(db, id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-dark-500" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero Header */}
      <View className="bg-dark-400 px-5 pt-14 pb-6 border-b border-gold-700/20">
        <View className="flex-row justify-between items-center">
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-gold-400 text-sm">&larr; Back</Text>
          </Pressable>
          <Pressable onPress={confirmDelete}>
            <Text className="text-red-400 text-sm">Delete</Text>
          </Pressable>
        </View>
        <Text className="text-gold-400 text-2xl font-bold mt-4">{character.name}</Text>
        <View className="flex-row gap-2 mt-2">
          <View className="bg-gold-700/20 px-3 py-1 rounded">
            <Text className="text-gold-300 text-xs">{character.race_name}</Text>
          </View>
          <View className="bg-gold-700/20 px-3 py-1 rounded">
            <Text className="text-gold-300 text-xs">{character.class_name}</Text>
          </View>
          <View className="bg-gold-700/20 px-3 py-1 rounded">
            <Text className="text-gold-300 text-xs">Level {character.level_number}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bars */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Vitality
        </Text>
        <ProgressBar label="Health" current={derived.health} max={derived.health * 1.2} color="#F87171" />
        <ProgressBar label="Mana" current={derived.mana} max={derived.mana * 1.2} color="#60A5FA" />
      </View>

      {/* Derived Stats */}
      <View className="px-5 mt-5">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Combat Stats
        </Text>
        <View className="flex-row justify-between bg-dark-400 rounded-lg p-4 border border-gold-700/20">
          <View className="items-center">
            <Text className="text-dark-50/50 text-[10px]">ATK POWER</Text>
            <Text className="text-gold-400 text-lg font-bold">{formatStat(derived.attackPower)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-50/50 text-[10px]">DEFENSE</Text>
            <Text className="text-green-400 text-lg font-bold">{formatStat(derived.defense)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-50/50 text-[10px]">HEALTH</Text>
            <Text className="text-red-400 text-lg font-bold">{formatStat(derived.health)}</Text>
          </View>
          <View className="items-center">
            <Text className="text-dark-50/50 text-[10px]">MANA</Text>
            <Text className="text-blue-400 text-lg font-bold">{formatStat(derived.mana)}</Text>
          </View>
        </View>
      </View>

      {/* Stat Grid */}
      <View className="px-5 mt-6">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Attributes
        </Text>
        <StatGrid stats={stats} />
      </View>

      {/* Skills */}
      <View className="px-5 mt-6">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Skills ({skills.length})
        </Text>
        {skills.length === 0 ? (
          <Text className="text-dark-50/30 text-sm">No skills learned</Text>
        ) : (
          skills.map(s => (
            <View key={s.id} className="bg-dark-400 border border-gold-700/10 rounded-lg p-3 mb-2 flex-row justify-between items-center">
              <View>
                <Text className="text-gold-300 text-sm font-semibold">{s.name}</Text>
                <Text className="text-dark-50/40 text-xs">{s.description}</Text>
              </View>
              <Pressable onPress={async () => { await removeSkillFromCharacter(db, id, s.id); load(); }}>
                <Text className="text-red-400/60 text-xs">Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Talents */}
      <View className="px-5 mt-6">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Talents ({talents.length})
        </Text>
        {talents.length === 0 ? (
          <Text className="text-dark-50/30 text-sm">No talents acquired</Text>
        ) : (
          talents.map(t => (
            <View key={t.id} className="bg-dark-400 border border-gold-700/10 rounded-lg p-3 mb-2 flex-row justify-between items-center">
              <View>
                <Text className="text-gold-300 text-sm font-semibold">{t.name}</Text>
                <Text className="text-dark-50/40 text-xs">{t.description}</Text>
              </View>
              <Pressable onPress={async () => { await removeTalentFromCharacter(db, id, t.id); load(); }}>
                <Text className="text-red-400/60 text-xs">Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Weapons */}
      <View className="px-5 mt-6">
        <Text className="text-gold-500 text-xs font-semibold mb-3 tracking-wider uppercase">
          Weapons ({weapons.length})
        </Text>
        {weapons.length === 0 ? (
          <Text className="text-dark-50/30 text-sm">No weapons equipped</Text>
        ) : (
          weapons.map(w => (
            <View key={w.id} className="bg-dark-400 border border-gold-700/10 rounded-lg p-3 mb-2 flex-row justify-between items-center">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-gold-300 text-sm font-semibold">{w.name}</Text>
                  {w.is_equipped ? (
                    <View className="bg-gold-500/20 px-2 py-0.5 rounded">
                      <Text className="text-gold-400 text-[10px]">EQUIPPED</Text>
                    </View>
                  ) : null}
                </View>
                <Text className="text-dark-50/40 text-xs mt-1">{w.description}</Text>
                <Text className="text-dark-50/30 text-[10px] mt-1">Weight: {w.weight} | ATK +{w.attack_bonus} | DEF +{w.defense_bonus}</Text>
              </View>
              <View className="flex-row gap-3">
                {!w.is_equipped && (
                  <Pressable onPress={async () => { await equipWeapon(db, id, w.id); load(); }}>
                    <Text className="text-green-400 text-xs">Equip</Text>
                  </Pressable>
                )}
                <Pressable onPress={async () => { await removeWeaponFromCharacter(db, id, w.id); load(); }}>
                  <Text className="text-red-400/60 text-xs">Remove</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Add buttons */}
      <View className="px-5 mt-6 gap-2">
        <Pressable
          className="bg-dark-400 border border-gold-700/30 rounded-lg p-3 items-center"
          onPress={() => navigation.navigate('AddItem', { characterId: id, type: 'skill' })}
        >
          <Text className="text-gold-400 text-sm">+ Add Skill</Text>
        </Pressable>
        <Pressable
          className="bg-dark-400 border border-gold-700/30 rounded-lg p-3 items-center"
          onPress={() => navigation.navigate('AddItem', { characterId: id, type: 'talent' })}
        >
          <Text className="text-gold-400 text-sm">+ Add Talent</Text>
        </Pressable>
        <Pressable
          className="bg-dark-400 border border-gold-700/30 rounded-lg p-3 items-center"
          onPress={() => navigation.navigate('AddItem', { characterId: id, type: 'weapon' })}
        >
          <Text className="text-gold-400 text-sm">+ Add Weapon</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
