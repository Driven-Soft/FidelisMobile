import React, { useContext } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { MOCK_VET_PROFILE } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';

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
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <View className="my-8 items-center">
            <AvatarBadge initials={MOCK_VET_PROFILE.initials} size={120} backgroundColor={MOCK_VET_PROFILE.avatarColor} style={{ marginBottom: 24 }} />
            <Text className="mb-2 text-2xl font-bold text-slate-900">{MOCK_VET_PROFILE.name}</Text>
            <Text className="text-sm text-slate-500">{MOCK_VET_PROFILE.specialty}</Text>
          </View>

          <SectionHeader title="Informações Profissionais" />
          <Card className="mb-4 border-l-4 border-slate-900">
            <Text className="mb-1 text-xs text-slate-500">Email</Text>
            <Text className="mb-3 text-base font-semibold text-slate-900">{MOCK_VET_PROFILE.email}</Text>

            <Text className="mb-1 text-xs text-slate-500">Telefone</Text>
            <Text className="mb-3 text-base font-semibold text-slate-900">{MOCK_VET_PROFILE.phone}</Text>

            <Text className="mb-1 text-xs text-slate-500">CRMV</Text>
            <Text className="mb-3 text-base font-semibold text-slate-900">{MOCK_VET_PROFILE.crmv}</Text>

            <Text className="mb-1 text-xs text-slate-500">Especialidade</Text>
            <Text className="text-base font-semibold text-slate-900">{MOCK_VET_PROFILE.specialty}</Text>
          </Card>

          <SectionHeader title="Clínica Vinculada" />
          <Card className="mb-4 border-l-4 border-slate-900">
            <Text className="mb-1 text-base font-bold text-cyan-600">{MOCK_VET_PROFILE.clinic.name}</Text>
            <Text className="text-sm text-slate-500">{MOCK_VET_PROFILE.clinic.address}</Text>
          </Card>

          <View className="mb-6 mt-4 space-y-3 pb-6">
            <Button
              title="Editar Perfil"
              variant="primary"
              onPress={() => {}}
            />
            <Button
              title="Sair"
              variant="danger"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileVet;
