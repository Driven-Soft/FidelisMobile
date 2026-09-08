import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/config/queryClient";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./src/context/UserContext";
import StackRoutes from "./src/routes/stack.routes";
import { StatusBar, LogBox, View } from "react-native";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { IBMPlexSans_400Regular } from "@expo-google-fonts/ibm-plex-sans/400Regular";
import { IBMPlexSans_500Medium } from "@expo-google-fonts/ibm-plex-sans/500Medium";
import { IBMPlexSans_600SemiBold } from "@expo-google-fonts/ibm-plex-sans/600SemiBold";
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono/400Regular";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    IBM_Plex_Sans_400Regular: IBMPlexSans_400Regular,
    IBM_Plex_Sans_500Medium: IBMPlexSans_500Medium,
    IBM_Plex_Sans_600SemiBold: IBMPlexSans_600SemiBold,
    IBM_Plex_Mono_400Regular: IBMPlexMono_400Regular,
    IBM_Plex_Mono_500Medium: IBMPlexMono_500Medium,
  });

  if (fontError) {
    console.warn("Não foi possivel carregar as fontes:", fontError);
  }

  if (!fontsLoaded && !fontError) {
    return <View className="flex-1 bg-mist" />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <NavigationContainer>
            <StatusBar hidden />
            <StackRoutes />
          </NavigationContainer>
        </UserProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
