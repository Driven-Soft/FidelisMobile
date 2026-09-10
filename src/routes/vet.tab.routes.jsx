import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PendingVet from '../screens/Veterinario/PendingVet';
import HomeVet from '../screens/Veterinario/HomeVet';
import PatientsVet from '../screens/Veterinario/PatientsVet';
import ProfileVet from '../screens/Veterinario/ProfileVet';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeVetScreen" component={HomeVet} />
      <Stack.Screen name="AgendaVet" component={PendingVet} />
      <Stack.Screen name="PatientRecord" component={PendingVet} />
    </Stack.Navigator>
  );
};

const PatientsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PatientsScreen" component={PatientsVet} />
      <Stack.Screen name="PatientRecord" component={PendingVet} />
    </Stack.Navigator>
  );
};

const AgendaStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AgendaVetScreen" component={PendingVet} />
      <Stack.Screen name="PatientRecord" component={PendingVet} />
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
      <Stack.Screen name="ProfileVetScreen" component={ProfileVet} />
    </Stack.Navigator>
  );
};

export default function VetTabRoutes() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 22);

  // Icone/label da tab: cor clinic quando ativo, icon-off/text-off quando inativo.
  const tabOptions = (label, icon) => ({
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
