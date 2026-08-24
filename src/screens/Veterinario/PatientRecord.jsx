import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { MOCK_VET_PATIENTS, MOCK_VET_PATIENT_RECORDS } from '../../data/fidelisData';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/Veterinario/Badge';

const PatientRecord = ({ route, navigation }) => {
  const { patientId } = route.params;
  const patient = MOCK_VET_PATIENTS.find((p) => p.id === patientId);
  const record = MOCK_VET_PATIENT_RECORDS[patientId] || MOCK_VET_PATIENT_RECORDS['1'];
  const [activeTab, setActiveTab] = useState('Consultas');
  const [expandedId, setExpandedId] = useState(null);

  const tabs = ['Consultas', 'Vacinas', 'Prescrições', 'Exames', 'Bem-estar'];

  const tabData = {
    Consultas: record.consultations,
    Vacinas: record.vaccinations,
    Prescrições: record.prescriptions,
    Exames: record.exams,
    'Bem-estar': record.wellness,
  };

  const currentItems = tabData[activeTab] || [];

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-6">
          <TouchableOpacity
            className="mb-3 mt-3 flex-row items-center gap-1 self-start"
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={16} color="#0E7A63" />
            <Text className="font-sans-medium text-eyebrow text-clinic">Voltar</Text>
          </TouchableOpacity>

          <View className="mb-3 rounded-card border border-line bg-card p-[14px]">
            <View className="flex-row items-center gap-3">
              <Avatar emoji={patient.avatar} name={patient.petName} size={72} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-screen tracking-screen text-ink">
                  {patient.petName}
                </Text>
                <Text className="mt-[2px] font-sans text-label text-slate">
                  {record.species} · {record.breed}
                </Text>
                <Text className="mt-[2px] font-mono text-label text-slate">
                  {record.sex} · {record.age} · {record.weight}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-3 flex-row flex-wrap gap-[10px]">
            <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">ESPÉCIE</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{record.species}</Text>
            </View>
            <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">RAÇA</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{record.breed}</Text>
            </View>
            <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">SEXO</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{record.sex}</Text>
            </View>
            <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">IDADE</Text>
              <Text className="mt-[3px] font-mono-medium text-body text-ink">{record.age}</Text>
            </View>
          </View>

          <View className="mb-3 rounded-card border border-l-4 border-line border-l-clinic bg-card p-[14px]">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="font-sans text-label text-slate">TUTOR</Text>
                <Text className="mt-[3px] font-sans-medium text-body text-ink">{record.tutorName}</Text>
                <Text className="mt-1 font-mono text-label text-slate">
                  Última consulta: {patient.lastConsultation.toLocaleDateString('pt-BR')}
                </Text>
                <Text className="mt-[2px] font-sans text-label text-slate">{record.clinic}</Text>
              </View>
              <Badge type="Preventiva" label="Paciente ativo" />
            </View>
            <View className="mt-[14px] flex-row gap-[10px]">
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 items-center justify-center rounded-control border border-line-strong bg-card px-[14px] py-2"
              >
                <Text className="font-sans-medium text-xs text-ink">Ligar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 items-center justify-center rounded-control border border-line-strong bg-card px-[14px] py-2"
              >
                <Text className="font-sans-medium text-xs text-ink">Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-3 flex-row border-b border-line">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`border-b-2 px-[10px] py-[9px] ${
                  activeTab === tab ? 'border-clinic' : 'border-transparent'
                }`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`font-sans-medium text-eyebrow ${
                    activeTab === tab ? 'text-clinic' : 'text-slate'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="pb-6">
            {currentItems.length > 0 ? currentItems.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setExpandedId(expanded ? null : item.id)}
                  className="mb-[10px] rounded-card border border-line bg-card p-[14px]"
                >
                  <Text className="font-mono text-label text-slate">
                    {item.date.toLocaleDateString('pt-BR')}
                  </Text>
                  <Text className="mt-[3px] font-sans-semibold text-title text-ink">{item.title}</Text>
                  <Text
                    className="mt-2 font-sans text-body text-slate"
                    numberOfLines={expanded ? undefined : 2}
                  >
                    {item.observations}
                  </Text>
                  <Text className="mt-3 font-sans-medium text-eyebrow text-clinic">
                    {expanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  </Text>
                </TouchableOpacity>
              );
            }) : (
              <View className="items-center justify-center p-6">
                <Text className="font-sans text-body text-slate">Nenhum registro em {activeTab}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientRecord;
