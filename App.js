import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/context/UserContext";
import StackRoutes from "./src/routes/stack.routes";
import { StatusBar, LogBox } from "react-native";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar hidden />
          <StackRoutes />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
