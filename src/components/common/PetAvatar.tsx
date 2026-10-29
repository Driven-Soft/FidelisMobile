import { useState } from "react";
import { Image } from "react-native";
import Avatar from "../common/Avatar";
import type { PetResponse } from "../../models/pet";

interface Props {
  pet: Pick<PetResponse, 'nome' | 'fotoUrl'>;
  size?: number;
}

export default function PetAvatar({ pet, size = 56 }: Props) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!pet.fotoUrl || failedUrl === pet.fotoUrl) return <Avatar name={pet.nome} size={size} radius={12} />;
  return <Image source={{ uri: pet.fotoUrl }} accessibilityLabel={`Foto de ${pet.nome}`}
    onError={() => setFailedUrl(pet.fotoUrl)} style={{ width: size, height: size, borderRadius: 12 }} />;
}
