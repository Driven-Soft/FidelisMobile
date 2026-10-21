import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PendingVet from '../screens/Veterinario/PendingVet';
import HomeVet from '../screens/Veterinario/HomeVet';
import PatientsVet from '../screens/Veterinario/PatientsVet';
import NewPet from '../screens/Veterinario/NewPet';
import ProfileVet from '../screens/Veterinario/ProfileVet';
import AgendaVet from '../screens/Veterinario/AgendaVet';

import type { ComponentProps } from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { VetHomeStackParamList, VetPatientsStackParamList, VetAgendaStackParamList, VetProfileStackParamList, VetTabParamList } from './types';

const HomeNavigator = createNativeStackNavigator<VetHomeStackParamList>();
const PatientsNavigator = createNativeStackNavigator<VetPatientsStackParamList>();
const AgendaNavigator = createNativeStackNavigator<VetAgendaStackParamList>();
const ProfileNavigator = createNativeStackNavigator<VetProfileStackParamList>();
const Tab = createBottomTabNavigator<VetTabParamList>();

const HomeStack = () => {
  return (
    <HomeNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeNavigator.Screen name="HomeVetScreen" component={HomeVet} />
      <HomeNavigator.Screen name="AgendaVet" component={AgendaVet} />
      <HomeNavigator.Screen name="PatientRecord" component={PendingVet} />
    </HomeNavigator.Navigator>
  );
};

const PatientsStack = () => {
  return (
    <PatientsNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientsNavigator.Screen name="PatientsScreen" component={PatientsVet} />
      <PatientsNavigator.Screen name="NewPet" component={NewPet} />
      <PatientsNavigator.Screen name="PatientRecord" component={PendingVet} />
    </PatientsNavigator.Navigator>
  );
};

const AgendaStack = () => {
  return (
    <AgendaNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AgendaNavigator.Screen name="AgendaVetScreen" component={AgendaVet} />
      <AgendaNavigator.Screen name="PatientRecord" component={PendingVet} />
    </AgendaNavigator.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <ProfileNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileNavigator.Screen name="ProfileVetScreen" component={ProfileVet} />
    </ProfileNavigator.Navigator>
  );
};

export default function VetTabRoutes() {
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
      <Tab.Screen name="Dashboard" component={HomeStack} options={tabOptions('Dashboard', 'grid')} />
      <Tab.Screen name="Patients" component={PatientsStack} options={tabOptions('Pets da clínica', 'heart')} />
      <Tab.Screen name="Agenda" component={AgendaStack} options={tabOptions('Agenda', 'calendar')} />
      <Tab.Screen name="Profile" component={ProfileStack} options={tabOptions('Perfil', 'user')} />
    </Tab.Navigator>
  );
}
