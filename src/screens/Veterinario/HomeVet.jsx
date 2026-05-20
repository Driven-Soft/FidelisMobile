import React, { useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_VET_PROFILE, MOCK_VET_PATIENTS, MOCK_VET_APPOINTMENTS, MOCK_VET_ALERTS, formatPtDate } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import AvatarBadge from '../../components/common/AvatarBadge';
import Button from '../../components/common/Button';

export default function HomeVet({ navigation }) {
  const { user } = useContext(UserContext);
  const vetName = user?.name ?? MOCK_VET_PROFILE.name;
  const stats = [
    { label: 'Pets ativos', value: MOCK_VET_PATIENTS.length, tone: '#0f172a' },
    { label: 'Consultas hoje', value: MOCK_VET_APPOINTMENTS.length, tone: '#06b6d4' },
    { label: 'Alertas pendentes', value: MOCK_VET_ALERTS.length, tone: '#ef4444' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <View className="mt-4 rounded-3xl bg-slate-900 p-6 shadow-sm">
          <Text className="mb-1 text-sm text-white/75">Olá, {vetName}</Text>
          <Text className="mb-2 text-4xl font-bold text-white">Agenda e pacientes em um só painel</Text>
          <Text className="text-sm leading-5 text-white/90">
            Revise os atendimentos do dia, acompanhe os alertas urgentes e abra a ficha clínica com um toque.
          </Text>
        </View>

        <View className="mt-6 flex-row space-x-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex-1 items-center">
              <Text className="text-4xl font-bold" style={{ color: stat.tone }}>{stat.value}</Text>
              <Text className="mt-1 text-center text-xs text-slate-500">{stat.label}</Text>
            </Card>
          ))}
        </View>

        <SectionHeader title="Agenda do dia" subtitle="Consultas agendadas para hoje" action={<Text onPress={() => navigation.navigate('AgendaVet')} className="font-semibold text-cyan-600">Ver tudo</Text>} />
        <View className="space-y-3">
          {MOCK_VET_APPOINTMENTS.map((appointment) => (
            <TouchableOpacity key={appointment.id} onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.petId })}>
              <Card className="border-l-4 pl-2 border-cyan-600">
                <View className="flex-row items-center justify-between space-x-4">
                  <View>
                    <Text className="text-2xl font-bold text-slate-900">{appointment.time}</Text>
                    <Text className="mt-1 text-base font-bold text-slate-900">{appointment.petName}</Text>
                  </View>
                  <Badge type={appointment.consultationType} label={appointment.consultationType} />
                </View>
                <Text className="mt-2 text-sm text-slate-500">{appointment.tutorName} • {appointment.petSpecies}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Alertas urgentes" subtitle="Vacinas atrasadas e retornos pendentes" />
        <View className="space-y-3">
          {MOCK_VET_ALERTS.map((alert) => (
            <TouchableOpacity key={alert.id} onPress={() => navigation.navigate('PatientRecord', { patientId: alert.petId })}>
              <Card className="border-l-4 border-red-500 pl-2">
                <View className="flex-row items-start justify-between space-x-4">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{alert.petName}</Text>
                    <Text className="mt-1 text-xs text-slate-500">{alert.tutorName}</Text>
                  </View>
                  <Badge type={alert.alertType} label={alert.alertType} />
                </View>
                <Text className="mt-3 text-sm text-slate-500">{alert.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6">
          <Button title="Abrir agenda completa" variant="secondary" onPress={() => navigation.navigate('AgendaVet')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
