import type { PatientsVetScreenProps } from "../../routes/types";
import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Input from '../../components/common/Input';
import PetAvatar from '../../components/Tutor/PetAvatar';
import TutorDataStatus from '../../components/Tutor/TutorDataStatus';
import { useClinicPets } from '../../hooks/useClinicPets';
import { usePetTutors } from '../../hooks/useVeterinarianPets';
import { petAgeLabel } from '../../utils/petUtils';

export default function PatientsVet({ navigation }: PatientsVetScreenProps) {
  const query = useClinicPets();
  const tutors = usePetTutors(query.hasClinic && query.data.length > 0);
  const tutorNames = new Map(tutors.data?.map((tutor) => [tutor.id, tutor.nome]));
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const species = [...new Set(query.data.map((pet) => pet.especie))];
  const filter = selectedFilter !== null && species.includes(selectedFilter) ? selectedFilter : null;
  const search = searchText.trim().toLocaleLowerCase('pt-BR');
  const pets = query.data.filter((pet) =>
    pet.nome.toLocaleLowerCase('pt-BR').includes(search) && (filter === null || pet.especie === filter));

  return <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-4 pb-6">
        <View className="mb-[10px] mt-4">
          <Text className="font-sans-semibold text-screen tracking-screen text-ink">Pets da clínica</Text>
          {query.hasClinic && <Text className="mt-1 font-sans text-body text-clinic">
            {query.clinicName ?? `Clínica #${query.clinicId}`}
          </Text>}
          <Text className="mt-1 font-sans text-label text-slate">Consulte os pets vinculados à sua clínica.</Text>
        </View>
        <TutorDataStatus query={query} label="pets da clínica" />
        {!query.isPending && !query.error && !query.hasClinic &&
          <Text className="font-sans text-body text-slate">Não há uma clínica válida vinculada ao seu perfil.</Text>}
        {query.hasClinic && <>
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('NewPet')} className="rounded-control bg-clinic p-3 mb-3"><Text className="font-sans-semibold text-body text-white">Cadastrar pet</Text></TouchableOpacity>
          <Input placeholder="Buscar pelo nome do pet..." value={searchText} onChangeText={setSearchText}
            icon={<Feather name="search" size={15} color="#5D706B" />} />
          <View className="mt-1 flex-row flex-wrap gap-1">
            {[null, ...species].map((option) => <TouchableOpacity key={option === null ? 'all' : `species-${option}`}
              accessibilityRole="button" accessibilityState={{ selected: filter === option }}
              onPress={() => setSelectedFilter(option)}
              className={`rounded-badge px-[10px] py-[5px] ${filter === option ? 'bg-clinic-50' : ''}`}>
              <Text className="font-sans-medium text-eyebrow text-clinic">{option ?? 'Todos'}</Text>
            </TouchableOpacity>)}
          </View>
          <View className="mt-3 flex-row flex-wrap gap-[10px]">
            {pets.map((pet) => <View key={pet.id} className="w-[48%] overflow-hidden rounded-card border border-line bg-card">
              <View className="items-center pt-[14px]"><PetAvatar pet={pet} size={72} /></View>
              <View className="gap-1 p-[14px]">
                <Text className="font-sans-semibold text-title text-ink">{pet.nome}</Text>
                <Text className="font-sans text-label text-slate">{pet.especie}</Text>
                <Text className="font-sans text-label text-slate">{pet.raca}</Text>
                <Text className="font-sans text-label text-slate">{pet.sexo === 'M' ? 'Macho' : pet.sexo === 'F' ? 'Fêmea' : 'Sexo não informado'}</Text>
                <Text className="font-mono text-label text-slate">{petAgeLabel(pet.dataNascimento)}</Text>
                <Text className="font-sans text-label text-clinic">
                  {tutors.isPending ? 'Carregando tutor...' : tutors.isError ? 'Nome do tutor indisponível' : `Tutor: ${tutorNames.get(pet.tutorId) ?? 'Não encontrado'}`}
                </Text>
                <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('NewPet', { petId: pet.id })}><Text className="font-sans-medium text-body text-clinic">Gerenciar pet</Text></TouchableOpacity>
              </View>
            </View>)}
          </View>
          {tutors.isError && <TouchableOpacity accessibilityRole="button" disabled={tutors.isFetching} onPress={() => tutors.refetch()}>
            <Text className="font-sans text-body text-clinic">Tentar carregar os nomes dos tutores novamente</Text>
          </TouchableOpacity>}
          {!query.isPending && !query.error && pets.length === 0 && <Text className="py-8 text-center font-sans text-body text-slate">
            {query.data.length === 0 ? 'Nenhum pet vinculado a esta clínica.' : 'Nenhum pet corresponde à busca.'}
          </Text>}
        </>}
      </View>
    </ScrollView>
  </SafeAreaView>;
}
