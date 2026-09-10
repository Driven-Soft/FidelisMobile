import TutorTabRoutes from "./tutor.tab.routes";
import VetTabRoutes from "./vet.tab.routes";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function TabRoutes() {
  // Parâmetros de navegação não concedem acesso a outro tipo de usuário.
  const { userType } = useContext(UserContext);

  if (userType === "VETERINARIO") {
    return <VetTabRoutes />;
  }

  return <TutorTabRoutes />;
}
