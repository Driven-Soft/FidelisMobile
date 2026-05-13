import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
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
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionHeader title="Nova Consulta" subtitle="Registre motivo, anamnese, diagnóstico e itens adicionais" />

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <View style={styles.chipGrid}>
            {MOCK_NEW_CONSULTATION_PATIENTS.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={[styles.chip, patientId === patient.id && styles.chipActive]}
                onPress={() => setPatientId(patient.id)}
              >
                <Text style={[styles.chipText, patientId === patient.id && styles.chipTextActive]}>{patient.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rowInputs}>
            <Input label="Data" value={date} onChangeText={setDate} style={{ flex: 1 }} />
            <Input label="Hora" value={time} onChangeText={setTime} style={{ flex: 1 }} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes da consulta</Text>
          <Input label="Motivo" placeholder="Ex.: retorno dermatológico" value={reason} onChangeText={setReason} />
          <Input label="Anamnese" placeholder="Relato do tutor e histórico clínico" value={anamnesis} onChangeText={setAnamnesis} multiline numberOfLines={4} />
          <Input label="Diagnóstico" placeholder="Conclusão clínica" value={diagnosis} onChangeText={setDiagnosis} multiline numberOfLines={3} />
          <Input label="Anotações clínicas" placeholder="Detalhes e orientações finais" value={notes} onChangeText={setNotes} multiline numberOfLines={4} />
        </Card>

        <Card style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Prescrições</Text>
            <Text style={styles.link} onPress={() => addItem(setPrescriptions)}>+ Adicionar</Text>
          </View>
          <View style={{ gap: SPACING.md }}>
            {prescriptions.map((item, index) => (
              <View key={item.id} style={styles.dynamicRow}>
                <Input
                  label={`Item ${index + 1}`}
                  placeholder="Medicamento, dosagem, frequência"
                  value={item.value}
                  onChangeText={(value) => updateItem(setPrescriptions, item.id, value)}
                  style={{ flex: 1 }}
                />
                <Text style={styles.removeLink} onPress={() => removeItem(setPrescriptions, item.id)}>Remover</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Exames</Text>
            <Text style={styles.link} onPress={() => addItem(setExams)}>+ Adicionar</Text>
          </View>
          <View style={{ gap: SPACING.md }}>
            {exams.map((item, index) => (
              <View key={item.id} style={styles.dynamicRow}>
                <Input
                  label={`Exame ${index + 1}`}
                  placeholder="Tipo, solicitação ou resultado"
                  value={item.value}
                  onChangeText={(value) => updateItem(setExams, item.id, value)}
                  style={{ flex: 1 }}
                />
                <Text style={styles.removeLink} onPress={() => removeItem(setExams, item.id)}>Remover</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Button title="Salvar consulta" variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>

        <Text style={styles.helperText}>Consulta salva em modo mock. Você pode expandir para persistência depois.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.lightGray,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  link: {
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  dynamicRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  removeLink: {
    color: COLORS.danger,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.xs,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default NewConsultation;
