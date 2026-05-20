import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './tab.routes';
import Login from '../screens/Login/Login';
import CadastroTutor from '../screens/Login/CadastroTutor';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CadastroTutor" component={CadastroTutor} />
      <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
  );
}