import React, { useContext } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MOCK_TUTOR_PETS, getPetAgeLabel } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import Avatar from '../../components/common/Avatar';

const PetsTutor = ({ navigation }) => {
  const { tutorPets } = useContext(UserContext);
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Meus Pets" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <Text className="font-sans text-body text-slate">
          Gerencie os perfis, consultas e cuidados dos seus animais.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('NewPet')}
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
          className="flex-row items-center gap-[11px] rounded-card border border-line bg-card px-[14px] py-[13px]"
        >
          <View className="h-[30px] w-[30px] items-center justify-center rounded-control bg-clinic-50">
            <Feather name="plus" size={16} color="#0E7A63" />
          </View>
          <View className="flex-1">
            <Text className="font-sans-medium text-body text-ink">Adicionar novo pet</Text>
            <Text className="font-sans text-label text-slate">
              Cadastro em 3 etapas com dados básicos, físicos e observações.
            </Text>
          </View>
        </Pressable>

        {pets.map((pet) => (
          <Pressable
            key={pet.id}
            accessibilityRole="button"
            onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="rounded-card border border-line bg-card p-[14px]"
          >
            <View className="flex-row items-center gap-3">
              <Avatar emoji={pet.avatar} name={pet.name} size={56} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-title text-ink">{pet.name}</Text>
                <Text className="mt-[2px] font-sans text-label text-slate">{pet.breed}</Text>
                <Text className="mt-[2px] font-mono text-label text-slate">
                  {getPetAgeLabel(pet.birthDate)} · {pet.sex}
                </Text>
                <Text className="mt-1 font-sans-medium text-label text-clinic">{pet.clinic}</Text>
              </View>
            </View>

            <View className="mt-[14px] items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]">
              <Text className="font-sans-medium text-xs text-ink">Abrir perfil</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default PetsTutor;
