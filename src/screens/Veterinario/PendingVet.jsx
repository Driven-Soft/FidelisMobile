import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PendingVet({ route }) {
  const patients = route.name === 'PatientsScreen';
  const record = route.name === 'PatientRecord';
  return <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
    <View className="gap-3 px-4 py-6">
      <Text className="font-sans-semibold text-screen text-ink">{patients ? 'Pets da clínica' : record ? 'Prontuário' : 'Agenda'}</Text>
      <Text className="font-sans text-body text-slate">
        {patients ? 'A visualização dos pets vinculados à sua clínica ainda não está disponível.' : 'Esta funcionalidade ainda não está integrada à API.'}
      </Text>
    </View>
  </SafeAreaView>;
}
