import type { ProfileTutorScreenProps } from '../../routes/types';
import NotificationPermissionsCard from '../../components/Tutor/NotificationPermissionsCard';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import { usePets } from '../../hooks/usePets';
import PetQueryStatus from '../../components/common/PetQueryStatus';
import { useTutorClinics, useTutorProfile } from '../../hooks/useTutorData';
import TutorDataStatus from '../../components/common/TutorDataStatus';
import { nameInitials } from '../../utils/tutorDataUtils';

const ProfileTutor = ({ navigation }: ProfileTutorScreenProps) => {
  const petsQuery = usePets();
  const profileQuery = useTutorProfile();
  const clinicsQuery = useTutorClinics();
  const tutor = profileQuery.data;
  const { logout } = useUserContext();

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Perfil" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <TutorDataStatus query={profileQuery} label="perfil" />
        {tutor && <>
          <View className="items-center rounded-card border border-line bg-card p-[14px]">
            <View className="h-20 w-20 items-center justify-center rounded-control bg-clinic-50">
              <Text className="font-sans-semibold text-clinic-ink" style={{ fontSize: 26 }}>{nameInitials(tutor.nome)}</Text>
            </View>
            <Text className="mt-3 font-sans-semibold text-title text-ink">{tutor.nome}</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">{tutor.email}</Text>
          </View>
          <View className="gap-[10px]">
            <Text className="font-sans-semibold text-title text-ink">Informações pessoais</Text>
            <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
              <View><Text className="font-sans text-label text-slate">EMAIL</Text><Text className="mt-[3px] font-sans-medium text-body text-ink">{tutor.email}</Text></View>
              <View><Text className="font-sans text-label text-slate">TELEFONE</Text><Text className="mt-[3px] font-mono-medium text-body text-ink">{tutor.telefone}</Text></View>
              <View><Text className="font-sans text-label text-slate">CPF</Text><Text className="mt-[3px] font-mono-medium text-body text-ink">{tutor.cpf}</Text></View>
            </View>
          </View>
        </>}
        <PetQueryStatus query={petsQuery} showBackgroundLoading={false} />
        <Pressable accessibilityRole="button" disabled={clinicsQuery.isFetching} onPress={() => { void clinicsQuery.refetch(); }}>
          <Text className="font-sans-medium text-body text-clinic">{clinicsQuery.isFetching ? 'Atualizando resumo...' : 'Atualizar resumo'}</Text>
        </Pressable>
        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Resumo</Text>
          <View className="flex-row gap-[10px]">
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">PETS CADASTRADOS</Text>
              <Text className="mt-[3px] font-mono-medium text-metric text-ink">{petsQuery.isPending || petsQuery.isError ? '—' : petsQuery.data?.length ?? 0}</Text>
            </View>
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">CLÍNICAS DOS PETS</Text>
              {clinicsQuery.isPending ? <Text className="mt-[3px] font-sans text-body text-slate">Carregando...</Text>
                : clinicsQuery.error ? <Text accessibilityRole="alert" className="mt-[3px] font-sans text-body text-alert">Não foi possível carregar. Atualize o resumo para tentar novamente.</Text>
                  : clinicsQuery.data.length === 0 ? <Text className="mt-[3px] font-sans text-body text-slate">Nenhuma clínica vinculada aos pets.</Text>
                    : clinicsQuery.data.map(clinic => <Text key={clinic.id} className="mt-[3px] font-sans-medium text-body text-ink">{clinic.nome}</Text>)}
            </View>
          </View>
        </View>
        <NotificationPermissionsCard />
        <View className="mt-1 gap-[10px]">
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('About')}
            className="items-center justify-center rounded-control border border-line bg-card px-[18px] py-[11px]">
            <Text className="font-sans-medium text-body text-clinic">Sobre o App</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => void logout()}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control border border-alert bg-card px-[18px] py-[11px]">
            <Text className="font-sans-medium text-xs text-alert">Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileTutor;
