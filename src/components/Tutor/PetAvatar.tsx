import { useState } from "react";
import { Image } from "react-native";
import Avatar from "../common/Avatar";

export default function PetAvatar({ pet, size = 56 }) {
  const [failedUrl, setFailedUrl] = useState(null);
  if (!pet.fotoUrl || failedUrl === pet.fotoUrl) return <Avatar name={pet.nome} size={size} radius={12} />;
  return <Image source={{ uri: pet.fotoUrl }} accessibilityLabel={`Foto de ${pet.nome}`}
    onError={() => setFailedUrl(pet.fotoUrl)} style={{ width: size, height: size, borderRadius: 12 }} />;
}
