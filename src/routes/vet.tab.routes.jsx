import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import HomeVet from "../screens/Veterinario/HomeVet";
import AgendaVet from "../screens/Veterinario/AgendaVet";
import ClientesVet from "../screens/Veterinario/ClientesVet";

const Tab = createBottomTabNavigator();

const vetTabs = [
  {
    name: "HomeVet",
    component: HomeVet,
    label: "Inicio",
    icon: "home",
  },
  {
    name: "AgendaVet",
    component: AgendaVet,
    label: "Agenda",
    icon: "activity",
  },
  {
    name: "ClientesVet",
    component: ClientesVet,
    label: "Clientes",
    icon: "users",
  },
];

export default function VetTabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2f8f83",
        tabBarInactiveTintColor: "#8a95a8",
      }}
    >
      {vetTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Feather name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
