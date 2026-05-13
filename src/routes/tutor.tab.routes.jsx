import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../styles/theme';

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: FONT_WEIGHTS.medium,
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
