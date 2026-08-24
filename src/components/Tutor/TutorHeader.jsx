import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

const TutorHeader = ({ eyebrow = 'Portal do Tutor', title, onBack, action }) => {
  return (
    <SafeAreaView edges={['top']} className="bg-card">
      <View className="flex-row items-center border-b border-line px-5 pb-[14px] pt-[10px]">
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={onBack}
            hitSlop={10}
            className="mr-3"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
          >
            <Feather name="chevron-left" size={22} color="#10201C" />
          </Pressable>
        ) : null}

        <View className="flex-1 pr-3">
          <Text className="font-sans text-eyebrow text-slate">{eyebrow}</Text>
          <Text className="font-sans-semibold text-screen tracking-screen text-ink" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {action}
      </View>
    </SafeAreaView>
  );
};

export default TutorHeader;
