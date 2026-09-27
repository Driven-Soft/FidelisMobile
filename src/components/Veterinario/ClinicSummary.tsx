import { Text, View } from 'react-native';
import TutorDataStatus from '../Tutor/TutorDataStatus';
import type { ClinicaResponse } from '../../models/veterinarian';

interface Props {
  query: {
    data: ClinicaResponse | undefined;
    isPending: boolean;
    isFetching: boolean;
    error: Error | null;
    refetch: () => Promise<unknown>;
  };
}

export default function ClinicSummary({ query }: Props) {
  const clinic = query.data;
  return <View className="gap-2 rounded-card border border-line bg-card p-[14px]">
    <Text className="font-sans-semibold text-title text-ink">Minha clínica</Text>
    <TutorDataStatus query={query} label="clínica" />
    {clinic && <>
      <Text className="font-sans-medium text-body text-clinic">{clinic.nome}</Text>
      <Text className="font-sans text-body text-slate">{clinic.endereco}</Text>
      <Text className="font-sans text-body text-slate">{clinic.telefone}</Text>
      <Text className="font-sans text-body text-slate">{clinic.email}</Text>
    </>}
  </View>;
}
