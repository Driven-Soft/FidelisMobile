import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './tab.routes';
import Login from '../screens/Login/Login';
import LoginVet from '../screens/Login/LoginVet';
import LoginTutor from '../screens/Login/LoginTutor';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginVet" component={LoginVet} />
      <Stack.Screen name="LoginTutor" component={LoginTutor} />
      <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
  );
}