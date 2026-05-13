import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeTutor from '../screens/Tutor/HomeTutor';
import PetsTutor from '../screens/Tutor/PetsTutor';
import NewPet from '../screens/Tutor/NewPet';
import RemindersScreen from '../screens/Tutor/RemindersScreen';
import ProfileTutor from '../screens/Tutor/ProfileTutor';
import PetProfile from '../screens/Tutor/PetProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTutorScreen" component={HomeTutor} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
      <Stack.Screen name="RemindersTutorScreen" component={RemindersScreen} />
    </Stack.Navigator>
  );
};

const PetsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PetsTutorScreen" component={PetsTutor} />
      <Stack.Screen name="NewPet" component={NewPet} />
      <Stack.Screen name="PetProfile" component={PetProfile} />
    </Stack.Navigator>
  );
};

const RemindersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RemindersScreenStack" component={RemindersScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileTutorScreen" component={ProfileTutor} />
    </Stack.Navigator>
  );
};

export default function TutorTabRoutes() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06b6d4',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: bottomInset,
          paddingTop: 8,
          height: 52 + bottomInset,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsStack}
        options={{
          tabBarLabel: 'Meus Pets',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🐾</Text>,
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersStack}
        options={{
          tabBarLabel: 'Lembretes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔔</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
