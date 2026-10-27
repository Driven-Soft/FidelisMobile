import { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';
import { formatWeight, formatWeightDate } from '../../utils/weightUtils';
import type { FaixaPeso, HistoricoPesoResponse, RiscoPeso } from '../../models/weight';

type Props = {
  weights: HistoricoPesoResponse[];
  range?: FaixaPeso;
  risk?: RiscoPeso;
};

const HEIGHT = 150;
const GUTTER = 36;
const PAD_RIGHT = 10;
const PAD_Y = 12;
const LABEL_HEIGHT = 14;

const COLOR_LINE = '#5D706B';
const COLOR_BAND = '#D8F0E7';
const COLOR_BAND_EDGE = '#0E7A63';

const dayOf = (value: string) => Date.parse(`${value.slice(0, 10)}T00:00:00`);

const WeightChart = ({ weights, range, risk }: Props) => {
  const [width, setWidth] = useState(0);

  const values = weights.map((item) => item.pesoKg);
  const bounds = range ? [...values, range.min, range.max] : values;
  const low = Math.min(...bounds);
  const high = Math.max(...bounds);
  const pad = Math.max((high - low) * 0.15, high * 0.04, 0.1);
  const yMin = Math.max(0, low - pad);
  const yMax = high + pad;

  const days = weights.map((item) => dayOf(item.dataMedicao));
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const plotWidth = Math.max(width - GUTTER - PAD_RIGHT, 0);
  const plotHeight = HEIGHT - PAD_Y * 2;

  const x = (day: number) => GUTTER + (lastDay === firstDay ? plotWidth / 2 : ((day - firstDay) / (lastDay - firstDay)) * plotWidth);
  const y = (value: number) => PAD_Y + (1 - (value - yMin) / (yMax - yMin)) * plotHeight;

  const points = weights.map((item, index) => ({ id: item.id, cx: x(days[index]), cy: y(item.pesoKg) }));
  const last = points[points.length - 1];

  const labels = range ? [range.max, range.min] : [Math.max(...values), Math.min(...values)];
  const visibleLabels = labels.filter((value, index) => index === 0 || Math.abs(y(value) - y(labels[0])) >= LABEL_HEIGHT);

  const summary = `Evolução do peso: ${weights.length} pesagens, de ${formatWeight(Math.min(...values))} a ${formatWeight(Math.max(...values))} kg.`
    + (range ? ` Faixa esperada de ${formatWeight(range.min)} a ${formatWeight(range.max)} kg.` : '');

  return (
    <View className="rounded-card border border-line bg-card p-[14px]">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-sans text-label text-slate">EVOLUÇÃO DO PESO</Text>
        <Text className="font-mono text-label text-slate">{weights.length} {weights.length === 1 ? 'pesagem' : 'pesagens'}</Text>
      </View>

      <View accessible accessibilityLabel={summary} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && (
          <View style={{ height: HEIGHT }}>
            <Svg width={width} height={HEIGHT}>
              {range && (
                <>
                  <Rect x={GUTTER} y={y(range.max)} width={plotWidth} height={y(range.min) - y(range.max)} fill={COLOR_BAND} />
                  <Line x1={GUTTER} x2={GUTTER + plotWidth} y1={y(range.max)} y2={y(range.max)}
                    stroke={COLOR_BAND_EDGE} strokeOpacity={0.4} strokeDasharray="4 4" />
                  <Line x1={GUTTER} x2={GUTTER + plotWidth} y1={y(range.min)} y2={y(range.min)}
                    stroke={COLOR_BAND_EDGE} strokeOpacity={0.4} strokeDasharray="4 4" />
                </>
              )}
              {points.length > 1 && (
                <Polyline points={points.map((p) => `${p.cx},${p.cy}`).join(' ')} fill="none" stroke={COLOR_LINE} strokeWidth={2} />
              )}
              {points.slice(0, -1).map((p) => <Circle key={p.id} cx={p.cx} cy={p.cy} r={3} fill={COLOR_LINE} />)}
              <Circle
                cx={last.cx}
                cy={last.cy}
                r={5.5}
                fill={risk === 'VERMELHO' ? '#C2513A' : risk === 'AMARELO' ? '#C8891A' : risk === 'VERDE' ? '#0E7A63' : COLOR_LINE}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </Svg>

            {visibleLabels.map((value) => (
              <Text
                key={value}
                className="font-mono text-micro text-slate"
                style={{ position: 'absolute', left: 0, width: GUTTER - 6, top: y(value) - LABEL_HEIGHT / 2, textAlign: 'right' }}
              >
                {formatWeight(value)}
              </Text>
            ))}
          </View>
        )}

        <View className="mt-1 flex-row justify-between" style={{ paddingLeft: GUTTER, paddingRight: PAD_RIGHT }}>
          <Text className="font-mono text-micro text-slate">{formatWeightDate(weights[0].dataMedicao)}</Text>
          {weights.length > 1 && <Text className="font-mono text-micro text-slate">{formatWeightDate(weights[weights.length - 1].dataMedicao)}</Text>}
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-4">
        <View className="flex-row items-center gap-[6px]">
          <View className="h-[2px] w-4" style={{ backgroundColor: COLOR_LINE }} />
          <Text className="font-sans text-label text-slate">Peso registrado</Text>
        </View>
        {range && (
          <View className="flex-row items-center gap-[6px]">
            <View className="h-[10px] w-4 rounded-[2px]" style={{ backgroundColor: COLOR_BAND }} />
            <Text className="font-sans text-label text-slate">Faixa esperada para o perfil</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default WeightChart;
