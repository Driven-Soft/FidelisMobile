import type { PetsTutorScreenProps } from '../../routes/types';
import { View, ScrollView, Text, Pressable, RefreshControl } from 'react-native';
import { usePets } from '../../hooks/usePets';
import { petAgeLabel } from '../../utils/petUtils';
import TutorHeader from '../../components/Tutor/TutorHeader';
import PetAvatar from '../../components/Tutor/PetAvatar';
import PetQueryStatus from '../../components/Tutor/PetQueryStatus';

const PetsTutor = ({ navigation }: PetsTutorScreenProps) => {
  const query = usePets();
  const pets = query.isError ? [] : query.data ?? [];

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Meus Pets" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]"
        refreshControl={<RefreshControl refreshing={query.isFetching && !query.isPending} onRefresh={() => query.refetch()} />}>
        <Text className="font-sans text-body text-slate">
          Acompanhe os pets e cuidados cadastrados pela sua cl?nica.
        </Text>

        <PetQueryStatus query={query} empty={pets.length === 0} />
        <Pressable onPress={() => query.refetch()} disabled={query.isFetching} accessibilityRole="button">
          <Text className="font-sans-medium text-body text-clinic">Atualizar lista</Text>
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
              <PetAvatar pet={pet} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-title text-ink">{pet.nome}</Text>
                <Text className="mt-[2px] font-sans text-label text-slate">{pet.raca}</Text>
                <Text className="mt-[2px] font-mono text-label text-slate">
                  {petAgeLabel(pet.dataNascimento)} · {pet.sexo === 'M' ? 'Macho' : 'Fêmea'}
                </Text>
                <Text className="mt-1 font-sans-medium text-label text-clinic">{pet.especie}</Text>
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
