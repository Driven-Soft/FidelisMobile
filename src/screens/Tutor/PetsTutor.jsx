import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TUTOR_PETS, getPetAgeLabel } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';
import Button from '../../components/common/Button';

const PetsTutor = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <SectionHeader
          title="Meus Pets"
          subtitle="Gerencie os perfis, consultas e cuidados dos seus animais"
        />

        <TouchableOpacity onPress={() => navigation.navigate('NewPet')} className="mb-4 items-center rounded-3xl border-2 border-dashed border-cyan-600 bg-cyan-50 p-6 shadow-sm">
          <Text className="text-[30px] font-bold text-cyan-600">＋</Text>
          <Text className="mt-2 text-lg font-bold text-slate-900">Adicionar novo pet</Text>
          <Text className="mt-1 text-center text-sm leading-5 text-slate-500">Cadastro em 3 etapas com dados básicos, físicos e observações.</Text>
        </TouchableOpacity>

        <View className="mt-3 space-y-3">
          {MOCK_TUTOR_PETS.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
            >
              <Card className="p-4">
                <View className="flex-row items-center">
                  <AvatarBadge
                    emoji={pet.avatar}
                    size={72}
                    backgroundColor={pet.color}
                    style={{ marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="mb-1 text-xl font-bold text-slate-900">{pet.name}</Text>
                    <Text className="mb-1 text-sm text-slate-500">{pet.breed}</Text>
                    <Text className="mb-1 text-sm text-slate-500">{getPetAgeLabel(pet.birthDate)} • {pet.sex}</Text>
                    <Text className="mt-1 text-xs font-semibold text-cyan-600">{pet.clinic}</Text>
                  </View>
                </View>
                <Button title="Abrir perfil" variant="outline" size="sm" style={{ marginTop: 16 }} onPress={() => navigation.navigate('PetProfile', { petId: pet.id })} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetsTutor;
