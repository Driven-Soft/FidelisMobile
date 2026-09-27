import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './tab.routes';
import Login from '../screens/Login/Login';
import CadastroTutor from '../screens/Login/CadastroTutor';
import { ActivityIndicator, Text, View } from 'react-native';
import { useUserContext } from '../context/UserContext';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  const { authStatus } = useUserContext();
  if (authStatus === 'restoring') {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-mist">
        <ActivityIndicator size="large" color="#0E7A63" />
        <Text className="font-sans text-body text-slate">Restaurando sessão...</Text>
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authStatus === 'authenticated' ? (
        <Stack.Screen name="Tabs" component={Tabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CadastroTutor" component={CadastroTutor} />
        </>
      )}
    </Stack.Navigator>
  );
}
