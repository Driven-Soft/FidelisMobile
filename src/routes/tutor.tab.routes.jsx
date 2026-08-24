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
