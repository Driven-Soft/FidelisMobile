import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/context/UserContext';
import StackRoutes from './src/routes/stack.routes';
import { StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar hidden />
        <StackRoutes />
      </NavigationContainer>
    </UserProvider>
  );
}
