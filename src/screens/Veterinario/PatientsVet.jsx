import React, { useMemo, useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_VET_PATIENTS } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/Veterinario/Badge';

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
        console.warn('[Fidelis] Nao foi possivel carregar os filtros salvos:', error);
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
        console.warn('[Fidelis] Nao foi possivel salvar os filtros:', error);
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
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <View className="mb-[10px] mt-4">
            <Text className="font-sans-semibold text-screen tracking-screen text-ink">Pacientes</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">
              Busque, filtre e abra a ficha clínica rapidamente
            </Text>
          </View>

          <Input
            placeholder="Buscar por nome ou tutor..."
            value={searchText}
            onChangeText={setSearchText}
            icon={<Feather name="search" size={15} color="#5D706B" />}
          />

          <View className="mt-1 flex-row flex-wrap gap-1">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`rounded-badge px-[10px] py-[5px] ${selectedFilter === option ? 'bg-clinic-50' : ''}`}
                onPress={() => setSelectedFilter(option)}
              >
                <Text
                  className={`font-sans-medium text-eyebrow ${
                    selectedFilter === option ? 'text-clinic-ink' : 'text-slate'
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredPatients.length > 0 ? (
            <View className="mt-3 flex-row flex-wrap gap-[10px] pb-6">
              {filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  className="w-[48%] overflow-hidden rounded-card border border-line bg-card"
                  onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })}
                >
                  <View className="items-center pt-[14px]">
                    <Avatar emoji={patient.avatar} name={patient.petName} size={72} radius={12} />
                  </View>
                  <View className="p-[14px]">
                    <Text className="font-sans-semibold text-title text-ink">{patient.petName}</Text>
                    <Text className="mt-[2px] font-sans text-label text-slate">{patient.petSpecies}</Text>
                    <Text className="mt-[2px] font-sans text-label text-slate">{patient.breed}</Text>
                    <Text className="mt-1 font-sans-medium text-label text-clinic">{patient.tutorName}</Text>
                    <Text className="mt-[2px] font-mono text-label text-slate">
                      Última: {patient.lastConsultation.toLocaleDateString('pt-BR')}
                    </Text>
                    <Badge type="Retorno" label={patient.clinic} style={{ marginTop: 10 }} />
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })}
                      className="mt-[14px] items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
                    >
                      <Text className="font-sans-medium text-xs text-ink">Ver Ficha</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center py-10">
              <Text className="font-sans text-body text-slate">Nenhum paciente encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientsVet;
