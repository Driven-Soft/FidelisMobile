import React, { useContext } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { UserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import { usePets } from '../../hooks/usePets';
import PetQueryStatus from '../../components/Tutor/PetQueryStatus';
import { useTutorProfile } from '../../hooks/useTutorData';
import TutorDataStatus from '../../components/Tutor/TutorDataStatus';
import { nameInitials } from '../../utils/tutorDataUtils';

const ProfileTutor = () => {
  const petsQuery = usePets();
  const profileQuery = useTutorProfile();
  const tutor = profileQuery.data;
  const { logout } = useContext(UserContext);

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Perfil" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <TutorDataStatus query={profileQuery} label="perfil" />
        {tutor && <>
          <View className="items-center rounded-card border border-line bg-card p-[14px]">
            <View className="h-20 w-20 items-center justify-center rounded-control bg-clinic-50">
              <Text className="font-sans-semibold text-clinic-ink" style={{ fontSize: 26 }}>{nameInitials(tutor.nome)}</Text>
            </View>
            <Text className="mt-3 font-sans-semibold text-title text-ink">{tutor.nome}</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">{tutor.email}</Text>
          </View>
          <View className="gap-[10px]">
            <Text className="font-sans-semibold text-title text-ink">Informações pessoais</Text>
            <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
              <View><Text className="font-sans text-label text-slate">EMAIL</Text><Text className="mt-[3px] font-sans-medium text-body text-ink">{tutor.email}</Text></View>
              <View><Text className="font-sans text-label text-slate">TELEFONE</Text><Text className="mt-[3px] font-mono-medium text-body text-ink">{tutor.telefone}</Text></View>
              <View><Text className="font-sans text-label text-slate">CPF</Text><Text className="mt-[3px] font-mono-medium text-body text-ink">{tutor.cpf}</Text></View>
            </View>
          </View>
        </>}
        <PetQueryStatus query={petsQuery} />
        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Resumo</Text>
          <View className="flex-row gap-[10px]">
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">PETS CADASTRADOS</Text>
              <Text className="mt-[3px] font-mono-medium text-metric text-ink">{petsQuery.isPending || petsQuery.isError ? '—' : petsQuery.data?.length ?? 0}</Text>
            </View>
            <View className="flex-1 rounded-card border border-line bg-card p-[13px]">
              <Text className="font-sans text-label text-slate">CLÍNICA VINCULADA</Text>
              <Text className="mt-[3px] font-sans-medium text-body text-ink">Vínculo do tutor não disponível</Text>
            </View>
          </View>
        </View>
        <View className="gap-[10px]">
          <Text className="font-sans-semibold text-title text-ink">Clínica vinculada</Text>
          <View className="rounded-card border border-line bg-card p-[14px]">
            <Text className="font-sans text-label text-slate">O perfil do tutor não informa vínculo com clínica. Consulte o vínculo de cada pet em seu perfil.</Text>
          </View>
        </View>
        <View className="mt-1 gap-[10px]">
          <Pressable accessibilityRole="button" disabled accessibilityState={{ disabled: true }}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3" style={{ opacity: 0.5 }}>
            <Text className="font-sans-semibold text-title text-white">Editar perfil (indisponível nesta etapa)</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => void logout()}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control border border-alert bg-card px-[18px] py-[11px]">
            <Text className="font-sans-medium text-xs text-alert">Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileTutor;
