import { View, Text } from 'react-native';
import { formatStat, STAT_KEYS } from '../utils/statCalculator';

const STAT_LABELS = {
  strength: 'STR',
  agility: 'AGI',
  intelligence: 'INT',
  vitality: 'VIT',
  willpower: 'WIL',
  luck: 'LCK',
};

const STAT_COLORS = {
  strength: '#D4A017',
  agility: '#4ADE80',
  intelligence: '#60A5FA',
  vitality: '#F87171',
  willpower: '#C084FC',
  luck: '#FBBF24',
};

export default function StatGrid({ stats }) {
  return (
    <View className="flex-row flex-wrap justify-between gap-3">
      {STAT_KEYS.map(key => (
        <View
          key={key}
          className="bg-dark-400 border border-gold-700/30 rounded-lg p-3 items-center w-[30%]"
        >
          <Text className="text-gold-400 text-xs font-semibold tracking-wider">
            {STAT_LABELS[key]}
          </Text>
          <Text
            className="text-lg font-bold mt-1"
            style={{ color: STAT_COLORS[key] }}
          >
            {formatStat(stats[key] ?? 0)}
          </Text>
        </View>
      ))}
    </View>
  );
}
