import React, { useContext, useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { MOCK_TUTOR_PETS, parsePtDate } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import Avatar from '../../components/common/Avatar';

const PetProfile = ({ route, navigation }) => {
  const { petId } = route.params;
  const { tutorPets } = useContext(UserContext);
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;
  const pet = pets.find((p) => p.id === petId);
  const [activeTab, setActiveTab] = useState('Vacinas');

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = parsePtDate(birthDate);
    if (!birth) return 0;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = ['Vacinas', 'Consultas', 'Medicamentos', 'Bem-estar'];

  if (!pet) {
    return (
      <View className="flex-1 bg-mist">
        <TutorHeader title="Pet" onBack={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="font-sans-medium text-body text-ink">Pet nao encontrado</Text>
          <Pressable
            className="mt-3"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
          >
            <Text className="font-sans-medium text-eyebrow text-clinic">Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title={pet.name} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <View className="items-center rounded-card border border-line bg-card p-[14px]">
          <Avatar emoji={pet.avatar} name={pet.name} size={96} radius={12} />
        </View>

        <View className="flex-row flex-wrap gap-[10px]">
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">ESPÉCIE</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.species}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">RAÇA</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.breed}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">SEXO</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.sex}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">IDADE</Text>
            <Text className="mt-[3px] font-mono-medium text-body text-ink">
              {calculateAge(pet.birthDate)} anos
            </Text>
          </View>
        </View>

        <View className="rounded-card border border-line bg-card p-[13px]">
          <Text className="font-sans text-label text-slate">CLÍNICA VINCULADA</Text>
          <Text className="mt-[3px] font-sans-medium text-body text-ink">
            {pet.clinic ?? pet.clinicAssociated ?? '-'}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1">
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === tab }}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
              className={`rounded-badge px-[10px] py-[5px] ${activeTab === tab ? 'bg-clinic-50' : ''}`}
            >
              <Text
                className={`font-sans-medium text-eyebrow ${
                  activeTab === tab ? 'text-clinic-ink' : 'text-slate'
                }`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="items-center rounded-card border border-line bg-card px-[14px] py-8">
          <Text className="font-sans text-body text-slate">Nenhum registro em {activeTab}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PetProfile;
