import TutorTabRoutes from "./tutor.tab.routes";
import VetTabRoutes from "./vet.tab.routes";

export default function TabRoutes({ route }) {
  const userType = route?.params?.userType ?? "TUTOR";

  if (userType === "VET") {
    return <VetTabRoutes />;
  }

  return <TutorTabRoutes />;
}