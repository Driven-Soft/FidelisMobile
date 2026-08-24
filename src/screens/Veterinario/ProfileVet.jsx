import React, { useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { MOCK_VET_PROFILE } from '../../data/fidelisData';
import Avatar from '../../components/common/Avatar';

const ProfileVet = ({ navigation }) => {
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <View className="my-6 items-center">
            <Avatar
              initials={MOCK_VET_PROFILE.initials}
              size={96}
              radius={12}
              style={{ marginBottom: 14 }}
            />
            <Text className="font-sans-semibold text-screen tracking-screen text-ink">
              {MOCK_VET_PROFILE.name}
            </Text>
            <Text className="mt-[2px] font-sans text-label text-slate">{MOCK_VET_PROFILE.specialty}</Text>
          </View>

          <Text className="mb-[10px] font-sans-semibold text-title text-ink">
            Informações Profissionais
          </Text>
          <View className="mb-4 gap-3 rounded-card border border-l-4 border-line border-l-clinic bg-card p-[14px]">
            <View>
              <Text className="font-sans text-label text-slate">EMAIL</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{MOCK_VET_PROFILE.email}</Text>
            </View>
            <View>
              <Text className="font-sans text-label text-slate">TELEFONE</Text>
              <Text className="mt-[3px] font-mono-medium text-body text-ink">{MOCK_VET_PROFILE.phone}</Text>
            </View>
            <View>
              <Text className="font-sans text-label text-slate">CRMV</Text>
              <Text className="mt-[3px] font-mono-medium text-body text-ink">{MOCK_VET_PROFILE.crmv}</Text>
            </View>
            <View>
              <Text className="font-sans text-label text-slate">ESPECIALIDADE</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">{MOCK_VET_PROFILE.specialty}</Text>
            </View>
          </View>

          <Text className="mb-[10px] font-sans-semibold text-title text-ink">Clínica Vinculada</Text>
          <View className="mb-4 rounded-card border border-l-4 border-line border-l-clinic bg-card p-[14px]">
            <Text className="font-sans-medium text-body text-clinic">{MOCK_VET_PROFILE.clinic.name}</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">{MOCK_VET_PROFILE.clinic.address}</Text>
          </View>

          <View className="mb-6 mt-1 gap-[10px] pb-6">
            <TouchableOpacity
              onPress={() => {}}
              className="items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="items-center justify-center rounded-control border border-alert bg-card px-[18px] py-[11px]"
            >
              <Text className="font-sans-medium text-xs text-alert">Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileVet;
