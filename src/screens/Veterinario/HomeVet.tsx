import { ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVeterinarian } from '../../hooks/useVeterinarian';
import TutorDataStatus from '../../components/Tutor/TutorDataStatus';
import ClinicSummary from '../../components/Veterinario/ClinicSummary';

export default function HomeVet({ navigation }) {
  const { profile, clinic, hasClinic } = useVeterinarian();
  return <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
    <ScrollView contentContainerClassName="gap-3 px-4 py-6">
      <Text className="font-sans-semibold text-screen text-ink">Portal do Veterinário</Text>
      <TutorDataStatus query={profile} label="perfil profissional" />
      {profile.data && <>
        <Text className="font-sans-semibold text-title text-ink">Olá, {profile.data.nome}</Text>
        <Text className="font-sans text-body text-slate">Acompanhe as informações da sua clínica.</Text>
        {hasClinic ? <ClinicSummary query={clinic} /> : <Text className="font-sans text-body text-slate">Vínculo com clínica não disponível.</Text>}
      </>}
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Patients')}
        className="items-center rounded-control bg-clinic px-5 py-3">
        <Text className="font-sans-semibold text-title text-white">Pets da clínica</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Profile')}
        className="items-center rounded-control border border-line bg-card px-5 py-3">
        <Text className="font-sans-semibold text-title text-clinic">Meu perfil profissional</Text>
      </Pressable>
    </ScrollView>
  </SafeAreaView>;
}
