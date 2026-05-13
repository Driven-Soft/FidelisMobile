import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';

const PetCard = ({ pet, onPress, isAddPetCard = false }) => {
  if (isAddPetCard) {
    return (
      <TouchableOpacity className="mr-4 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-cyan-600 bg-slate-100 p-4 shadow-sm" onPress={onPress}>
        <Text className="mb-4 text-[32px] text-cyan-600">➕</Text>
        <Text className="text-center text-sm font-semibold text-cyan-600">Adicionar{'\n'}pet</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity className="mr-4 w-36 items-center rounded-2xl bg-white p-4 shadow-sm" onPress={onPress}>
      <Image
        source={pet.profileImage}
        className="mb-4 h-20 w-20 rounded-2xl bg-slate-100"
        defaultSource={require('../../../assets/icon.png')}
      />
      <Text className="mb-1 text-center text-sm font-semibold text-slate-900">{pet.name}</Text>
      <Text className="text-center text-xs text-slate-500">{pet.species}</Text>
    </TouchableOpacity>
  );
};

export default PetCard;
