import { View, Text, Pressable } from 'react-native';

export default function CharacterCard({ character, derived, stats, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-dark-300 border border-gold-700/20 rounded-xl p-4 mb-3 active:opacity-80"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gold-400 text-lg font-bold">{character.name}</Text>
        <Text className="text-gold-600 text-xs">Lv.{character.level_number}</Text>
      </View>
      <View className="flex-row gap-2 mb-3">
        <View className="bg-dark-500 px-2 py-1 rounded">
          <Text className="text-gold-300 text-xs">{character.race_name}</Text>
        </View>
        <View className="bg-dark-500 px-2 py-1 rounded">
          <Text className="text-gold-300 text-xs">{character.class_name}</Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-dark-50/50 text-[10px]">HP</Text>
          <Text className="text-red-400 text-sm font-semibold">
            {derived?.health ?? '—'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-dark-50/50 text-[10px]">MP</Text>
          <Text className="text-blue-400 text-sm font-semibold">
            {derived?.mana ?? '—'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-dark-50/50 text-[10px]">ATK</Text>
          <Text className="text-gold-400 text-sm font-semibold">
            {derived?.attackPower ?? '—'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-dark-50/50 text-[10px]">DEF</Text>
          <Text className="text-green-400 text-sm font-semibold">
            {derived?.defense ?? '—'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

