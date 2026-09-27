import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import HomeTutor from '../screens/Tutor/HomeTutor';
import PetsTutor from '../screens/Tutor/PetsTutor';
import NewPet from '../screens/Tutor/NewPet';
import RemindersScreen from '../screens/Tutor/RemindersScreen';
import ProfileTutor from '../screens/Tutor/ProfileTutor';
import PetProfile from '../screens/Tutor/PetProfile';

import type { ComponentProps } from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { TutorHomeStackParamList, TutorPetsStackParamList, TutorRemindersStackParamList, TutorProfileStackParamList, TutorTabParamList } from './types';

const HomeNavigator = createNativeStackNavigator<TutorHomeStackParamList>();
const PetsNavigator = createNativeStackNavigator<TutorPetsStackParamList>();
const RemindersNavigator = createNativeStackNavigator<TutorRemindersStackParamList>();
const ProfileNavigator = createNativeStackNavigator<TutorProfileStackParamList>();
const Tab = createBottomTabNavigator<TutorTabParamList>();

const HomeStack = () => {
  return (
    <HomeNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeNavigator.Screen name="HomeTutorScreen" component={HomeTutor} />
      <HomeNavigator.Screen name="PetProfile" component={PetProfile} />
      <HomeNavigator.Screen name="RemindersTutorScreen" component={RemindersScreen} />
    </HomeNavigator.Navigator>
  );
};

const PetsStack = () => {
  return (
    <PetsNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PetsNavigator.Screen name="PetsTutorScreen" component={PetsTutor} />
      <PetsNavigator.Screen name="NewPet" component={NewPet} />
      <PetsNavigator.Screen name="PetProfile" component={PetProfile} />
    </PetsNavigator.Navigator>
  );
};

const RemindersStack = () => {
  return (
    <RemindersNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RemindersNavigator.Screen name="RemindersScreenStack" component={RemindersScreen} />
    </RemindersNavigator.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <ProfileNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileNavigator.Screen name="ProfileTutorScreen" component={ProfileTutor} />
    </ProfileNavigator.Navigator>
  );
};

export default function TutorTabRoutes() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 22);

  // Icone/label da tab: cor clinic quando ativo, icon-off/text-off quando inativo.
  const tabOptions = (label: string, icon: ComponentProps<typeof Feather>['name']): BottomTabNavigationOptions => ({
    tabBarIcon: ({ focused }) => (
      <Feather name={icon} size={20} color={focused ? '#0E7A63' : '#D3DEDB'} />
    ),
    tabBarLabel: ({ focused }) => (
      <Text
        className={`mt-[5px] text-badge ${
          focused ? 'font-sans-semibold text-clinic' : 'font-sans text-text-off'
        }`}
      >
        {label}
      </Text>
    ),
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E9E7',
          borderTopWidth: 1,
          paddingTop: 10,
          paddingHorizontal: 10,
          paddingBottom: bottomInset,
          height: 49 + bottomInset,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={tabOptions('Início', 'home')} />
      <Tab.Screen name="Pets" component={PetsStack} options={tabOptions('Meus Pets', 'heart')} />
      <Tab.Screen
        name="Reminders"
        component={RemindersStack}
        options={tabOptions('Lembretes', 'bell')}
      />
      <Tab.Screen name="Profile" component={ProfileStack} options={tabOptions('Perfil', 'user')} />
    </Tab.Navigator>
  );
}
