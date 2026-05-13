import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TUTOR_PETS } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import AvatarBadge from '../../components/common/AvatarBadge';

const PetProfile = ({ route, navigation }) => {
  const { petId } = route.params;
  const pet = MOCK_TUTOR_PETS.find((p) => p.id === petId);
  const [activeTab, setActiveTab] = useState('Vacinas');

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
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
      <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-base font-semibold text-slate-900">Pet nao encontrado</Text>
          <TouchableOpacity className="mt-4" onPress={() => navigation.goBack()}>
            <Text className="font-semibold text-cyan-600">Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-6">
          <View className="mb-4 items-center rounded-2xl bg-white p-6 shadow-sm">
            <AvatarBadge emoji={pet.avatar} size={120} backgroundColor={pet.color} />
          </View>

          <Text className="mb-4 text-4xl font-bold text-slate-900">{pet.name}</Text>

          <View className="mb-4 flex-row flex-wrap gap-3">
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Espécie</Text>
              <Text className="text-base font-semibold text-slate-900">{pet.species}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Raça</Text>
              <Text className="text-base font-semibold text-slate-900">{pet.breed}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Sexo</Text>
              <Text className="text-base font-semibold text-slate-900">{pet.sex}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Idade</Text>
              <Text className="text-base font-semibold text-slate-900">{calculateAge(pet.birthDate)} anos</Text>
            </Card>
          </View>

          <Card className="mb-4">
            <Text className="mb-1 text-xs text-slate-500">Clínica Vinculada</Text>
            <Text className="text-base font-semibold text-slate-900">{pet.clinicAssociated}</Text>
          </Card>

          <View className="mb-4 flex-row border-b-2 border-slate-200">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`px-4 py-3 border-b-4 ${activeTab === tab ? 'border-cyan-600' : 'border-transparent'}`}
                onPress={() => setActiveTab(tab)}
              >
                <Text className={`text-sm font-medium ${activeTab === tab ? 'text-cyan-600' : 'text-slate-500'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="items-center justify-center p-6">
            <Text className="text-sm text-slate-500">Nenhum registro em {activeTab}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfile;
