import React, { useContext } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS } from '../../data/fidelisData';
import TutorHeader from '../../components/Tutor/TutorHeader';

const ProfileTutor = () => {
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    void logout();
  };

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Perfil" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <View className="items-center rounded-card border border-line bg-card p-[14px]">
          <View className="h-20 w-20 items-center justify-center rounded-control bg-clinic-50">
            <Text className="font-sans-semibold text-clinic-ink" style={{ fontSize: 26 }}>
              {MOCK_TUTOR_PROFILE.initials}
            </Text>
          </View>
          <Text className="mt-3 font-sans-semibold text-title text-ink">{MOCK_TUTOR_PROFILE.name}</Text>
          <Text className="mt-[2px] font-sans text-label text-slate">{MOCK_TUTOR_PROFILE.email}</Text>
        </View>

        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Informações pessoais</Text>
          <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
            <View>
              <Text className="font-sans text-label text-slate">EMAIL</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{MOCK_TUTOR_PROFILE.email}</Text>
            </View>
            <View>
              <Text className="font-sans text-label text-slate">TELEFONE</Text>
              <Text className="mt-[3px] font-mono-medium text-body text-ink">{MOCK_TUTOR_PROFILE.phone}</Text>
            </View>
            <View>
              <Text className="font-sans text-label text-slate">CPF</Text>
              <Text className="mt-[3px] font-mono-medium text-body text-ink">{MOCK_TUTOR_PROFILE.cpf}</Text>
            </View>
          </View>
        </View>

        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Resumo</Text>
          <View className="flex-row gap-[10px]">
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">PETS CADASTRADOS</Text>
              <Text className="mt-[3px] font-mono-medium text-metric text-ink">{MOCK_TUTOR_PETS.length}</Text>
            </View>
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">CLÍNICA VINCULADA</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{MOCK_TUTOR_PROFILE.clinic}</Text>
            </View>
          </View>
        </View>

        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Clínica vinculada</Text>
          <View className="rounded-card border border-line bg-card p-[14px]">
            <Text className="font-sans text-label text-slate">CLÍNICA</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{MOCK_TUTOR_PROFILE.clinic}</Text>
          </View>
        </View>

        <View className="mt-1 gap-[10px]">
          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3"
          >
            <Text className="font-sans-semibold text-title text-white">Editar perfil</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control border border-alert bg-card px-[18px] py-[11px]"
          >
            <Text className="font-sans-medium text-xs text-alert">Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileTutor;
