import React, { useContext } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';

const ProfileTutor = ({ navigation }) => {
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
            <AvatarBadge initials={MOCK_TUTOR_PROFILE.initials} size={120} backgroundColor={MOCK_TUTOR_PROFILE.avatarColor} style={{ marginBottom: 24 }} />
            <Text className="mb-2 text-2xl font-bold text-slate-900">{MOCK_TUTOR_PROFILE.name}</Text>
            <Text className="text-sm text-slate-500">{MOCK_TUTOR_PROFILE.email}</Text>
          </View>

          <SectionHeader title="Informações Pessoais" />
          <Card className="mb-4">
            <Text className="mb-1 text-xs text-slate-500">Email</Text>
            <Text className="mb-3 text-base font-semibold text-slate-900">{MOCK_TUTOR_PROFILE.email}</Text>

            <Text className="mb-1 text-xs text-slate-500">Telefone</Text>
            <Text className="mb-3 text-base font-semibold text-slate-900">{MOCK_TUTOR_PROFILE.phone}</Text>

            <Text className="mb-1 text-xs text-slate-500">CPF</Text>
            <Text className="text-base font-semibold text-slate-900">{MOCK_TUTOR_PROFILE.cpf}</Text>
          </Card>

          <SectionHeader title="Resumo" />
          <View className="flex-row flex-wrap gap-3">
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Pets cadastrados</Text>
              <Text className="text-xl font-bold text-cyan-600">{MOCK_TUTOR_PETS.length}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: '48%' }}>
              <Text className="mb-1 text-xs text-slate-500">Clínica vinculada</Text>
              <Text className="text-base font-semibold text-slate-900">{MOCK_TUTOR_PROFILE.clinic}</Text>
            </Card>
          </View>

          <SectionHeader title="Clínica Vinculada" />
          <Card className="mb-4">
            <Text className="mb-1 text-xs text-slate-500">Clínica</Text>
            <Text className="text-base font-semibold text-slate-900">{MOCK_TUTOR_PROFILE.clinic}</Text>
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

export default ProfileTutor;
