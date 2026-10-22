import { View, ScrollView, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import TutorHeader from '../components/Tutor/TutorHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Atualize manualmente com o commit de referência antes de gerar o APK.
const COMMIT_HASH = "COLOCAR_HASH_AQUI";

type Props = NativeStackScreenProps<{ About: undefined }, 'About'>;

export default function AboutScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-mist">
      <TutorHeader eyebrow="FidelisMobile" title="Sobre o App" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerClassName="gap-4 px-4 py-6">
        <View className="items-center gap-3 rounded-card border border-line bg-card p-6">
          <View className="h-16 w-16 items-center justify-center rounded-control bg-clinic-50">
            <Feather name="heart" size={30} color="#0E7A63" />
          </View>
          <Text accessibilityRole="header" className="font-sans-semibold text-screen text-ink">FidelisMobile</Text>
          <Text className="text-center font-sans text-body text-slate">Cuide de quem você ama, do jeito certo.</Text>
        </View>
        <View className="gap-4 rounded-card border border-line bg-card p-4">
          <View>
            <Text className="font-sans text-label text-slate">VERSÃO</Text>
            <Text selectable className="mt-1 font-mono-medium text-title text-ink">1.0.0</Text>
          </View>
          <View>
            <Text className="font-sans text-label text-slate">COMMIT DE REFERÊNCIA</Text>
            <Text selectable className="mt-1 font-mono text-body text-ink">{COMMIT_HASH}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
