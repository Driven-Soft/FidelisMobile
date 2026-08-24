import React, { useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_VET_PROFILE, MOCK_VET_PATIENTS, MOCK_VET_APPOINTMENTS, MOCK_VET_ALERTS } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import Badge from '../../components/Veterinario/Badge';

export default function HomeVet({ navigation }) {
  const { user } = useContext(UserContext);
  const vetName = user?.name ?? MOCK_VET_PROFILE.name;

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <View className="mt-4 rounded-card border border-line bg-card p-[18px]">
          <Text className="font-sans text-eyebrow text-slate">Olá, {vetName}</Text>
          <Text className="mt-1 font-sans-semibold text-screen tracking-screen text-ink">
            Agenda e pacientes em um só painel
          </Text>
          <Text className="mt-2 font-sans text-body text-slate">
            Revise os atendimentos do dia, acompanhe os alertas urgentes e abra a ficha clínica com um toque.
          </Text>
        </View>

        <View className="mt-3 flex-row gap-[10px]">
          <View className="flex-1 items-center rounded-card border border-line bg-card p-[13px]">
            <Text className="font-mono-medium text-metric text-ink">{MOCK_VET_PATIENTS.length}</Text>
            <Text className="mt-1 text-center font-sans text-label text-slate">Pets ativos</Text>
          </View>
          <View className="flex-1 items-center rounded-card border border-line bg-card p-[13px]">
            <Text className="font-mono-medium text-metric text-clinic">{MOCK_VET_APPOINTMENTS.length}</Text>
            <Text className="mt-1 text-center font-sans text-label text-slate">Consultas hoje</Text>
          </View>
          <View className="flex-1 items-center rounded-card border border-line bg-card p-[13px]">
            <Text className="font-mono-medium text-metric text-alert">{MOCK_VET_ALERTS.length}</Text>
            <Text className="mt-1 text-center font-sans text-label text-slate">Alertas pendentes</Text>
          </View>
        </View>

        <View className="mb-[10px] mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-title text-ink">Agenda do dia</Text>
            <Text
              onPress={() => navigation.navigate('AgendaVet')}
              className="font-sans-medium text-eyebrow text-clinic"
            >
              Ver tudo
            </Text>
          </View>
          <Text className="mt-[2px] font-sans text-label text-slate">Consultas agendadas para hoje</Text>
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
              <Text className="mt-2 font-sans text-label text-slate">
                {appointment.tutorName} · {appointment.petSpecies}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-[10px] mt-5">
          <Text className="font-sans-semibold text-title text-ink">Alertas urgentes</Text>
          <Text className="mt-[2px] font-sans text-label text-slate">
            Vacinas atrasadas e retornos pendentes
          </Text>
        </View>

        <View className="gap-[10px]">
          {MOCK_VET_ALERTS.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              onPress={() => navigation.navigate('PatientRecord', { patientId: alert.petId })}
              className="rounded-card border border-l-4 border-line border-l-alert bg-card p-[14px]"
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="font-sans-medium text-body text-ink">{alert.petName}</Text>
                  <Text className="mt-1 font-sans text-label text-slate">{alert.tutorName}</Text>
                </View>
                <Badge type={alert.alertType} label={alert.alertType} />
              </View>
              <Text className="mt-3 font-sans text-body text-slate">{alert.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-5">
          <TouchableOpacity
            onPress={() => navigation.navigate('AgendaVet')}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3"
          >
            <Text className="font-sans-semibold text-title text-white">Abrir agenda completa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
