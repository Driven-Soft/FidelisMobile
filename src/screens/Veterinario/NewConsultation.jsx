import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_NEW_CONSULTATION_PATIENTS } from '../../data/fidelisData';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';

const emptyItem = { id: String(Date.now()), value: '' };

const NewConsultation = ({ route, navigation }) => {
  const initialPatientId = route?.params?.patientId ?? MOCK_NEW_CONSULTATION_PATIENTS[0]?.id ?? '';
  const [patientId, setPatientId] = useState(initialPatientId);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ ...emptyItem, value: '' }]);
  const [exams, setExams] = useState([{ ...emptyItem, value: '' }]);

  const selectedPatient = useMemo(
    () => MOCK_NEW_CONSULTATION_PATIENTS.find((patient) => patient.id === patientId),
    [patientId]
  );

  const addItem = (setter) => setter((current) => [...current, { id: String(Date.now() + Math.random()), value: '' }]);
  const updateItem = (setter, itemId, value) => setter((current) => current.map((item) => (item.id === itemId ? { ...item, value } : item)));
  const removeItem = (setter, itemId) => setter((current) => current.length > 1 ? current.filter((item) => item.id !== itemId) : current);

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <SectionHeader title="Nova Consulta" subtitle="Registre motivo, anamnese, diagnóstico e itens adicionais" />

        <Card className="mb-4">
          <Text className="mb-4 text-lg font-bold text-slate-900">Paciente</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {MOCK_NEW_CONSULTATION_PATIENTS.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                className={`rounded-full px-4 py-2 ${patientId === patient.id ? 'bg-slate-900' : 'bg-slate-200'}`}
                onPress={() => setPatientId(patient.id)}
              >
                <Text className={`text-xs font-medium ${patientId === patient.id ? 'text-white' : 'text-slate-500'}`}>{patient.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row space-x-3">
            <Input label="Data" value={date} onChangeText={setDate} style={{ flex: 1 }} />
            <Input label="Hora" value={time} onChangeText={setTime} style={{ flex: 1 }} />
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="mb-4 text-lg font-bold text-slate-900">Detalhes da consulta</Text>
          <Input label="Motivo" placeholder="Ex.: retorno dermatológico" value={reason} onChangeText={setReason} />
          <Input label="Anamnese" placeholder="Relato do tutor e histórico clínico" value={anamnesis} onChangeText={setAnamnesis} multiline numberOfLines={4} />
          <Input label="Diagnóstico" placeholder="Conclusão clínica" value={diagnosis} onChangeText={setDiagnosis} multiline numberOfLines={3} />
          <Input label="Anotações clínicas" placeholder="Detalhes e orientações finais" value={notes} onChangeText={setNotes} multiline numberOfLines={4} />
        </Card>

        <Card className="mb-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">Prescrições</Text>
            <Text className="font-semibold text-cyan-600" onPress={() => addItem(setPrescriptions)}>+ Adicionar</Text>
          </View>
          <View className="space-y-3">
            {prescriptions.map((item, index) => (
              <View key={item.id} className="border-b border-slate-200 pb-3">
                <Input
                  label={`Item ${index + 1}`}
                  placeholder="Medicamento, dosagem, frequência"
                  value={item.value}
                  onChangeText={(value) => updateItem(setPrescriptions, item.id, value)}
                  style={{ flex: 1 }}
                />
                <Text className="-mt-2 mb-1 text-xs font-semibold text-red-500" onPress={() => removeItem(setPrescriptions, item.id)}>Remover</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card className="mb-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">Exames</Text>
            <Text className="font-semibold text-cyan-600" onPress={() => addItem(setExams)}>+ Adicionar</Text>
          </View>
          <View className="space-y-3">
            {exams.map((item, index) => (
              <View key={item.id} className="border-b border-slate-200 pb-3">
                <Input
                  label={`Exame ${index + 1}`}
                  placeholder="Tipo, solicitação ou resultado"
                  value={item.value}
                  onChangeText={(value) => updateItem(setExams, item.id, value)}
                  style={{ flex: 1 }}
                />
                <Text className="-mt-2 mb-1 text-xs font-semibold text-red-500" onPress={() => removeItem(setExams, item.id)}>Remover</Text>
              </View>
            ))}
          </View>
        </Card>

        <View className="mb-4 flex-row space-x-3">
          <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Button title="Salvar consulta" variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>

        <Text className="text-center text-xs leading-5 text-slate-500">Consulta salva em modo mock. Você pode expandir para persistência depois.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewConsultation;
