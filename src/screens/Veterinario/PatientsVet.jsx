import React, { useMemo, useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_VET_PATIENTS } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import AvatarBadge from '../../components/common/AvatarBadge';
import Badge from '../../components/common/Badge';

const PatientsVet = ({ navigation }) => {
  const { user, userType } = useContext(UserContext);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filterOptions = ['Todos', 'Cão', 'Gato', 'Ave', 'Outros'];

  const storageKey = useMemo(() => {
    const owner = user?.email ?? 'guest';
    const portal = userType ?? 'VET';
    return `@fidelis:vetPatientsFilter:${portal}:${owner}`;
  }, [user?.email, userType]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (typeof parsed?.searchText === 'string') {
          setSearchText(parsed.searchText);
        }
        if (filterOptions.includes(parsed?.selectedFilter)) {
          setSelectedFilter(parsed.selectedFilter);
        }
      } catch (error) {
      }
    };

    loadFilters();
  }, [storageKey]);

  useEffect(() => {
    const persistFilters = async () => {
      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({ searchText, selectedFilter })
        );
      } catch (error) {
      }
    };

    persistFilters();
  }, [searchText, selectedFilter, storageKey]);

  const filteredPatients = useMemo(() => {
    return MOCK_VET_PATIENTS.filter((patient) => {
      const query = searchText.toLowerCase();
      const matchesSearch =
        patient.petName.toLowerCase().includes(query) ||
        patient.tutorName.toLowerCase().includes(query);
      const matchesFilter = selectedFilter === 'Todos' || patient.petSpecies === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchText, selectedFilter]);

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <SectionHeader title="Pacientes" subtitle="Busque, filtre e abra a ficha clínica rapidamente" />

          <Input
            placeholder="Buscar por nome ou tutor..."
            value={searchText}
            onChangeText={setSearchText}
            icon={<Text>🔍</Text>}
          />

          <View className="mt-4 flex-row flex-wrap gap-2">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`rounded-full border px-4 py-2 ${selectedFilter === option ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white'}`}
                onPress={() => setSelectedFilter(option)}
              >
                <Text className={`text-sm font-medium ${selectedFilter === option ? 'text-white' : 'text-slate-500'}`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredPatients.length > 0 ? (
            <View className="mt-4 flex-row flex-wrap gap-3 pb-6">
              {filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  className="w-[48%]"
                  onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })}
                >
                  <Card padding={false} className="overflow-hidden">
                    <View className="items-center pt-4">
                      <AvatarBadge emoji={patient.avatar} size={78} backgroundColor={patient.color} />
                    </View>
                    <View className="p-4">
                      <Text className="mb-1 text-sm font-semibold text-slate-900">{patient.petName}</Text>
                      <Text className="mb-1 text-xs text-slate-500">{patient.petSpecies}</Text>
                      <Text className="mb-1 text-xs text-slate-500">{patient.breed}</Text>
                      <Text className="mb-2 text-xs font-medium text-cyan-600">{patient.tutorName}</Text>
                      <Text className="mb-3 text-xs text-slate-500">Última: {patient.lastConsultation.toLocaleDateString('pt-BR')}</Text>
                      <Badge type="Retorno" label={patient.clinic} style={{ marginBottom: 12 }} />
                      <Button title="Ver Ficha" variant="primary" size="sm" onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })} />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center py-10">
              <Text className="text-base text-slate-500">Nenhum paciente encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientsVet;
