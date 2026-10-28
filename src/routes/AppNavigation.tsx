import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, Text, View } from 'react-native';
import { useNotificationNavigation } from '../hooks/useNotificationNavigation';
import { navigationRef } from './navigationRef';
import StackRoutes from './stack.routes';

export default function AppNavigation() {
  const { onNavigationReady, error } = useNotificationNavigation();
  return <NavigationContainer ref={navigationRef} onReady={onNavigationReady} onStateChange={onNavigationReady}>
    <StatusBar hidden />
    {error && <View className="bg-mist px-4 py-2"><Text accessibilityRole="alert" className="font-sans text-body text-alert">{error}</Text></View>}
    <StackRoutes />
  </NavigationContainer>;
}
