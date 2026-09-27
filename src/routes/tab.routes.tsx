import TutorTabRoutes from "./tutor.tab.routes";
import VetTabRoutes from "./vet.tab.routes";
import { useUserContext } from "../context/UserContext";

export default function TabRoutes() {
  // Parâmetros de navegação não concedem acesso a outro tipo de usuário.
  const { userType } = useUserContext();

  if (userType === "VETERINARIO") {
    return <VetTabRoutes />;
  }

  return <TutorTabRoutes />;
}
