import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../styles/theme';

import HomeVet from '../screens/Veterinario/HomeVet';
import PatientsVet from '../screens/Veterinario/PatientsVet';
import PatientRecord from '../screens/Veterinario/PatientRecord';
import AgendaVet from '../screens/Veterinario/AgendaVet';
import NewConsultation from '../screens/Veterinario/NewConsultation';
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
      <Stack.Screen name="AgendaVet" component={AgendaVet} />
      <Stack.Screen name="PatientRecord" component={PatientRecord} />
      <Stack.Screen name="NewConsultation" component={NewConsultation} />
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
      <Stack.Screen name="PatientRecord" component={PatientRecord} />
      <Stack.Screen name="NewConsultation" component={NewConsultation} />
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
      <Stack.Screen name="AgendaVetScreen" component={AgendaVet} />
      <Stack.Screen name="NewConsultation" component={NewConsultation} />
      <Stack.Screen name="PatientRecord" component={PatientRecord} />
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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
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
        name="Dashboard"
        component={HomeStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientsStack}
        options={{
          tabBarLabel: 'Pacientes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🐾</Text>,
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaStack}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
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