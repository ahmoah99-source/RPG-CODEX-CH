import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
  getAllSkills, getAllTalents, getAllWeapons,
  addSkillToCharacter, addTalentToCharacter, addWeaponToCharacter,
} from '../database/crud';

export default function AddItemScreen() {
  const db = useSQLiteContext();
  const route = useRoute();
  const navigation = useNavigation();
  const { characterId, type } = route.params;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data;
      if (type === 'skill') data = await getAllSkills(db);
      else if (type === 'talent') data = await getAllTalents(db);
      else data = await getAllWeapons(db);
      setItems(data);
      setLoading(false);
    })();
  }, [db, type]);

  if (loading) {
    return (
      <View className="flex-1 bg-dark-500 items-center justify-center">
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  async function handleAdd(item) {
    if (type === 'skill') await addSkillToCharacter(db, characterId, item.id);
    else if (type === 'talent') await addTalentToCharacter(db, characterId, item.id);
    else await addWeaponToCharacter(db, characterId, item.id, 0);
    navigation.goBack();
  }

  const title = type === 'skill' ? 'Skills' : type === 'talent' ? 'Talents' : 'Weapons';

  return (
    <ScrollView className="flex-1 bg-dark-500" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-5 pt-14 pb-4 bg-dark-400 border-b border-gold-700/20">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-gold-400 text-sm">&larr; Back</Text>
        </Pressable>
        <Text className="text-gold-400 text-xl font-bold mt-3">Add {title}</Text>
      </View>

      <View className="px-5 mt-4">
        {items.map(item => (
          <Pressable
            key={item.id}
            className="bg-dark-400 border border-gold-700/10 rounded-lg p-4 mb-3 active:bg-dark-300"
            onPress={() => handleAdd(item)}
          >
            <Text className="text-gold-300 text-sm font-semibold">{item.name}</Text>
            <Text className="text-dark-50/40 text-xs mt-1">{item.description}</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {['strength', 'agility', 'intelligence', 'vitality', 'willpower', 'luck'].map(stat => {
                const val = item[`${stat}_bonus`];
                if (!val) return null;
                return (
                  <View key={stat} className="bg-dark-500 px-2 py-0.5 rounded">
                    <Text className="text-dark-50/50 text-[10px] uppercase">
                      {stat.slice(0, 3)} +{val}
                    </Text>
                  </View>
                );
              })}
              {type === 'weapon' && (
                <>
                  <View className="bg-dark-500 px-2 py-0.5 rounded">
                    <Text className="text-dark-50/50 text-[10px]">WGT {item.weight}</Text>
                  </View>
                  <View className="bg-dark-500 px-2 py-0.5 rounded">
                    <Text className="text-dark-50/50 text-[10px]">ATK +{item.attack_bonus}</Text>
                  </View>
                  <View className="bg-dark-500 px-2 py-0.5 rounded">
                    <Text className="text-dark-50/50 text-[10px]">DEF +{item.defense_bonus}</Text>
                  </View>
                </>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
