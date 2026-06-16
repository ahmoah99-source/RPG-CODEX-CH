import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from './src/database/init';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="character_codex.db"
        onInit={initializeDatabase}
        options={{ useNewConnection: true }}
        fallback={
          <View className="flex-1 bg-dark-500 items-center justify-center">
            <ActivityIndicator size="large" color="#D4A017" />
            <Text className="text-gold-400 mt-4">Initializing Codex...</Text>
          </View>
        }
      >
        <StatusBar style="light" />
        <AppNavigator />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
