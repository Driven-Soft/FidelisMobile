import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_VET_PATIENTS, MOCK_VET_PATIENT_RECORDS } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import AvatarBadge from '../../components/common/AvatarBadge';
import Badge from '../../components/common/Badge';

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
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-6">
          <TouchableOpacity className="mb-3 self-start" onPress={() => navigation.goBack()}>
            <Text className="font-semibold text-cyan-600">← Voltar</Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['#1E6FAE', '#163A6F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mb-4 rounded-3xl p-6 shadow-sm"
          >
            <View className="flex-row items-center space-x-4">
              <AvatarBadge emoji={patient.avatar} size={92} backgroundColor={patient.color} />
              <View className="flex-1">
                <Text className="mb-1 text-4xl font-bold text-white">{patient.petName}</Text>
                <Text className="mb-1 text-sm text-white/90">{record.species} • {record.breed}</Text>
                <Text className="text-sm text-white/90">{record.sex} • {record.age} • {record.weight}</Text>
              </View>
            </View>
          </LinearGradient>

          <View className="mb-4 flex-row flex-wrap gap-3">
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Espécie</Text>
              <Text className="text-base font-semibold text-slate-900">{record.species}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Raça</Text>
              <Text className="text-base font-semibold text-slate-900">{record.breed}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Sexo</Text>
              <Text className="text-base font-semibold text-slate-900">{record.sex}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Idade</Text>
              <Text className="text-base font-semibold text-slate-900">{record.age}</Text>
            </Card>
          </View>

          <Card className="pl-2 mb-4 border-l-4 border-slate-900">
            <View className="flex-row items-start justify-between space-x-4">
              <View className="flex-1">
                <Text className="mb-1 text-xs text-slate-500">Tutor</Text>
                <Text className="mb-1 text-base font-bold text-slate-900">{record.tutorName}</Text>
                <Text className="text-xs text-slate-500">Última consulta: {patient.lastConsultation.toLocaleDateString('pt-BR')}</Text>
                <Text className="mt-1 text-xs text-slate-500">{record.clinic}</Text>
              </View>
              <Badge type="Preventiva" label="Paciente ativo" />
            </View>
            <View className="mt-4 flex-row space-x-3">
              <Button title="Ligar" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => {}} />
              <Button title="Email" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => {}} />
            </View>
          </Card>

          <View className="mb-4 flex-row border-b border-slate-200">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`border-b-4 px-4 py-3 ${activeTab === tab ? 'border-slate-900' : 'border-transparent'}`}
                onPress={() => setActiveTab(tab)}
              >
                <Text className={`text-sm font-medium ${activeTab === tab ? 'text-slate-900' : 'text-slate-500'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="pb-6">
            {currentItems.length > 0 ? currentItems.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <TouchableOpacity key={item.id} onPress={() => setExpandedId(expanded ? null : item.id)}>
                  <Card className="mb-3">
                    <Text className="mb-1 text-xs text-slate-500">{item.date.toLocaleDateString('pt-BR')}</Text>
                    <Text className="text-base font-bold text-slate-900">{item.title}</Text>
                    <Text className="mt-2 text-sm leading-5 text-slate-500" numberOfLines={expanded ? undefined : 2}>
                      {item.observations}
                    </Text>
                    <Text className="mt-3 font-semibold text-cyan-600">
                      {expanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            }) : (
              <View className="items-center justify-center p-6">
                <Text className="text-sm text-slate-500">Nenhum registro em {activeTab}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientRecord;
