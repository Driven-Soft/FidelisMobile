import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_VET_APPOINTMENTS } from '../../data/fidelisData';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SectionHeader from '../../components/common/SectionHeader';

export default function AgendaVet({ navigation }) {
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <SectionHeader
          title="Agenda"
          subtitle={`Consultas de ${todayLabel}`}
          action={<Button title="Nova" variant="primary" size="sm" onPress={() => navigation.navigate('NewConsultation')} />}
        />

        <View className="space-y-3">
          {MOCK_VET_APPOINTMENTS.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.petId })}
            >
              <Card className="border-l-4 border-slate-900">
                <View className="flex-row items-center justify-between space-x-4">
                  <View>
                    <Text className="text-4xl font-bold text-slate-900">{appointment.time}</Text>
                    <Text className="mt-1 text-base font-bold text-slate-900">{appointment.petName}</Text>
                  </View>
                  <Badge type={appointment.consultationType} label={appointment.consultationType} />
                </View>
                <Text className="mt-2 text-sm text-slate-500">{appointment.tutorName}</Text>
                <Text className="mt-1 text-sm text-slate-500">{appointment.petSpecies}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
