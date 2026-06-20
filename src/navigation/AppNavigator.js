import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// الشاشات الأساسية
import DashboardScreen from '../screens/DashboardScreen';
import DetailScreen from '../screens/DetailScreen';
import CreateScreen from '../screens/CreateScreen';
import AddItemScreen from '../screens/AddItemScreen';

// شاشات المستويات
import LevelsListScreen from '../screens/LevelsListScreen';
import AddLevelScreen from '../screens/AddLevelScreen';

// شاشات المواهب والرتب
import TalentsListScreen from '../screens/TalentsListScreen';
import AddTalentScreen from '../screens/AddTalentScreen';
import RanksListScreen from '../screens/RanksListScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#101018' },
  animation: 'slide_from_right',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {/* الشاشات الأساسية */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        
        {/* شاشات المستويات */}
        <Stack.Screen name="LevelsList" component={LevelsListScreen} />
        <Stack.Screen name="AddLevel" component={AddLevelScreen} />
        
        {/* شاشات المواهب والرتب */}
        <Stack.Screen name="TalentsList" component={TalentsListScreen} />
        <Stack.Screen name="AddTalent" component={AddTalentScreen} />
        <Stack.Screen name="RanksList" component={RanksListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
