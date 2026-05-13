import React, { useContext, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { MOCK_TUTOR_PROFILE, MOCK_VET_PROFILE } from '../../data/fidelisData';
import PortalToggle from '../../components/common/PortalToggle';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function Login({ navigation }) {
  const { portalToggle, setPortalToggle, loginTutor, loginVet } = useContext(UserContext);
  const [portalType, setPortalType] = useState(portalToggle ?? 'TUTOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setPortalToggle(portalType);
    if (portalType === 'TUTOR') {
      loginTutor(MOCK_TUTOR_PROFILE);
    } else {
      loginVet(MOCK_VET_PROFILE);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs', params: { userType: portalType } }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView
        contentContainerClassName="flex-grow px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={portalType === 'TUTOR' ? ['#0FA3B1', '#163A6F'] : ['#163A6F', '#0F274A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-6 overflow-hidden rounded-3xl p-6 shadow-sm"
        >
          <View className="mb-4 flex-row items-center space-x-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Text className="text-[28px]">🐾</Text>
            </View>
            <View className="flex-1">
              <Text className="text-4xl font-bold text-white">Fidelis</Text>
              <Text className="mt-2 text-sm text-white/70">
                Portal {portalType === 'TUTOR' ? 'do Tutor' : 'do Veterinário'}
              </Text>
            </View>
          </View>
          <Text className="mt-2 text-base leading-6 text-white/90">
            Cuide de quem você ama com informações claras, lembretes e histórico clínico sempre à mão.
          </Text>
        </LinearGradient>

        <View className="mb-6">
          <Card>
            <View className="mb-6">
              <PortalToggle
                selected={portalType}
                onToggle={(value) => {
                  setPortalType(value);
                  setPortalToggle(value);
                }}
              />
            </View>

            <Input
              label="Email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              icon={<Text>✉️</Text>}
            />

            <Input
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              type="password"
              icon={<Text>🔒</Text>}
            />

            <Button
              title="Entrar"
              variant="primary"
              onPress={handleLogin}
              style={{ marginTop: 16 }}
            />

            <Text className={`mt-4 mb-4 text-center text-sm font-semibold ${portalType === 'TUTOR' ? 'text-cyan-600' : 'text-slate-900'}`}>
              Esqueci minha senha
            </Text>

            <View className="mt-4 flex-row gap-3">
              <Text className="flex-1 text-xs leading-5 text-slate-500">
                Acesso mockado para demonstração. Não há autenticação real.
              </Text>
            </View>
          </Card>
        </View>

        <View className="mt-4 flex-row justify-center gap-2">
          <Text className="text-sm text-slate-500">Não tem conta?</Text>
          <Text
            className={`text-sm font-bold ${portalType === 'TUTOR' ? 'text-cyan-600' : 'text-slate-900'}`}
            onPress={() => {
              if (portalType === 'TUTOR') {
                navigation.navigate('CadastroTutor');
              } else {
                navigation.navigate('CadastroVet');
              }
            }}
          >
            Cadastre-se
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}