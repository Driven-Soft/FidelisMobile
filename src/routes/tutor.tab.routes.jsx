import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import HomeTutor from "../screens/Tutor/HomeTutor";
import ConsultasTutor from "../screens/Tutor/ConsultasTutor";
import PerfilTutor from "../screens/Tutor/PerfilTutor";

const Tab = createBottomTabNavigator();

const tutorTabs = [
  {
    name: "HomeTutor",
    component: HomeTutor,
    label: "Inicio",
    icon: "home",
  },
  {
    name: "ConsultasTutor",
    component: ConsultasTutor,
    label: "Consultas",
    icon: "calendar",
  },
  {
    name: "PerfilTutor",
    component: PerfilTutor,
    label: "Perfil",
    icon: "user",
  },
];

export default function TutorTabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2f8f83",
        tabBarInactiveTintColor: "#8a95a8",
      }}
    >
      {tutorTabs.map((tab) => (
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
