import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_VET_APPOINTMENTS } from '../../data/fidelisData';
import Badge from '../../components/Veterinario/Badge';

export default function AgendaVet({ navigation }) {
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <View className="mb-[10px] mt-4">
          <Text className="font-sans-semibold text-screen tracking-screen text-ink">Agenda</Text>
          <Text className="mt-[2px] font-sans text-label text-slate">Consultas de {todayLabel}</Text>
        </View>

        <View className="gap-[10px]">
          {MOCK_VET_APPOINTMENTS.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.petId })}
              className="rounded-card border border-l-4 border-line border-l-clinic bg-card p-[14px]"
            >
              <View className="flex-row items-center justify-between gap-3">
                <View>
                  <Text className="font-mono-medium text-metric text-ink">{appointment.time}</Text>
                  <Text className="mt-1 font-sans-medium text-body text-ink">{appointment.petName}</Text>
                </View>
                <Badge type={appointment.consultationType} label={appointment.consultationType} />
              </View>
              <Text className="mt-2 font-sans text-label text-slate">{appointment.tutorName}</Text>
              <Text className="mt-[2px] font-sans text-label text-slate">{appointment.petSpecies}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
