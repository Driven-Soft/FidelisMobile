import { View, Text } from 'react-native';
import { formatWeight, formatWeightDate, weightRiskLabel } from '../../utils/weightUtils';
import type { AvaliacaoPesoResponse } from '../../models/weight';

type Props = {
  assessment: AvaliacaoPesoResponse;
};

const WeightAssessmentCard = ({ assessment }: Props) => {
  const { avaliacao } = assessment;
  const label = weightRiskLabel(avaliacao.risco);
  const texto = avaliacao.acoes.find((acao) => acao.registro === 'RECOMENDACAO')?.descricao ?? avaliacao.justificativa;

  return (
    <View
      className={`rounded-card border p-[14px] ${
        avaliacao.risco === 'VERMELHO' ? 'border-alert bg-alert-50' : avaliacao.risco === 'AMARELO' ? 'border-attention-line bg-attention-50' : 'border-line bg-card'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-label text-slate">AVALIAÇÃO DE PESO · IA</Text>
        <View
          className={`rounded-badge px-2 py-1 ${
            avaliacao.risco === 'VERMELHO' ? 'bg-alert' : avaliacao.risco === 'AMARELO' ? 'bg-attention-line' : 'bg-clinic-50'
          }`}
        >
          <Text
            className={`font-sans-semibold text-badge ${
              avaliacao.risco === 'VERMELHO' ? 'text-white' : avaliacao.risco === 'AMARELO' ? 'text-attention-ink' : 'text-clinic-ink'
            }`}
          >
            {label}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-end gap-6">
        <View>
          <Text className="font-sans text-label text-slate">PESO ATUAL</Text>
          <Text className="font-mono-medium text-metric text-ink">
            {formatWeight(avaliacao.pesoInformadoKg)}
            <Text className="font-mono text-body text-slate"> kg</Text>
          </Text>
        </View>
        <View className="pb-1">
          <Text className="font-sans text-label text-slate">FAIXA ESPERADA</Text>
          <Text className="font-mono-medium text-title text-ink">
            {formatWeight(avaliacao.faixaEsperadaKg.min)} – {formatWeight(avaliacao.faixaEsperadaKg.max)} kg
          </Text>
        </View>
      </View>

      <Text className="mt-3 font-sans text-body text-ink">{texto}</Text>

      <Text className="mt-3 font-sans text-label text-slate">
        Pesagem de {formatWeightDate(assessment.dataMedicao)}. Estimativa para o perfil do pet; não substitui a avaliação do veterinário.
      </Text>
    </View>
  );
};

export default WeightAssessmentCard;
