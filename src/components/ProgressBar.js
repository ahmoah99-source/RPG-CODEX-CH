import { View, Text } from 'react-native';

export default function ProgressBar({ label, current, max, color = '#D4A017' }) {
  const pct = max > 0 ? Math.min(current / max, 1) : 0;

  return (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-dark-50 text-xs font-semibold">{label}</Text>
        <Text className="text-dark-50 text-xs">{current} / {max}</Text>
      </View>
      <View className="h-3 bg-dark-700 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}
