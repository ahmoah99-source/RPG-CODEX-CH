import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import DetailScreen from '../screens/DetailScreen';
import CreateScreen from '../screens/CreateScreen';
import AddItemScreen from '../screens/AddItemScreen';
// إضافة استيراد صفحات المستويات الجديدة
import LevelsListScreen from '../screens/LevelsListScreen';
import AddLevelScreen from '../screens/AddLevelScreen';

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
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        {/* تسجيل صفحات المستويات في الـ Navigator */}
        <Stack.Screen name="LevelsList" component={LevelsListScreen} />
        <Stack.Screen name="AddLevel" component={AddLevelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
