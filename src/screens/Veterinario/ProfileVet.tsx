import type { ProfileVetScreenProps } from '../../routes/types';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext } from '../../context/UserContext';
import Avatar from '../../components/common/Avatar';
import { useVeterinarian } from '../../hooks/useVeterinarian';
import TutorDataStatus from '../../components/common/TutorDataStatus';
import ClinicSummary from '../../components/Veterinario/ClinicSummary';
import { nameInitials } from '../../utils/tutorDataUtils';

export default function ProfileVet({ navigation }: ProfileVetScreenProps) {
  const { logout } = useUserContext();
  const { profile, clinic, hasClinic } = useVeterinarian();
  const veterinarian = profile.data;
  return <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
    <ScrollView contentContainerClassName="gap-3 px-4 py-6">
      <Text className="font-sans-semibold text-screen text-ink">Perfil profissional</Text>
      <TutorDataStatus query={profile} label="perfil profissional" />
      {veterinarian && <>
        <View className="items-center gap-3">
          <Avatar initials={nameInitials(veterinarian.nome)} size={96} radius={12} />
          <Text className="font-sans-semibold text-title text-ink">{veterinarian.nome}</Text>
        </View>
        <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
          <Text className="font-sans text-label text-slate">EMAIL</Text>
          <Text className="font-sans-medium text-body text-ink">{veterinarian.email}</Text>
          <Text className="font-sans text-label text-slate">CRMV</Text>
          <Text className="font-mono-medium text-body text-ink">{veterinarian.crmv}</Text>
          <Text className="font-sans text-label text-slate">ESPECIALIDADE</Text>
          <Text className="font-sans-medium text-body text-ink">{veterinarian.especialidade}</Text>
        </View>
        {hasClinic ? <ClinicSummary query={clinic} /> : <Text className="font-sans text-body text-slate">Vínculo com clínica não disponível.</Text>}
      </>}
      <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('About')}
        className="items-center justify-center rounded-control border border-line bg-card px-[18px] py-[11px]">
        <Text className="font-sans-medium text-body text-clinic">Sobre o App</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => void logout()}
        className="items-center justify-center rounded-control border border-alert bg-card px-[18px] py-[11px]">
        <Text className="font-sans-medium text-xs text-alert">Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>;
}
