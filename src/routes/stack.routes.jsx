import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './tab.routes';
import Login from '../screens/Login/Login';
import CadastroTutor from '../screens/Login/CadastroTutor';
import { useContext } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { UserContext } from '../context/UserContext';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  const { authStatus } = useContext(UserContext);
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
        <Stack.Screen name="Tabs" component={Tabs} initialParams={{ userType: 'TUTOR' }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CadastroTutor" component={CadastroTutor} />
        </>
      )}
    </Stack.Navigator>
  );
}
