import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { MOCK_TUTOR_PROFILE, MOCK_VET_PROFILE } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
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

  const getAccentColor = () => {
    return portalType === 'TUTOR' ? COLORS.accent : COLORS.primary;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
    },
    headerContainer: {
      marginBottom: SPACING.xl,
    },
    hero: {
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      marginBottom: SPACING.xl,
      overflow: 'hidden',
      ...SHADOWS.md,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    logoBubble: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    appName: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
    },
    tagline: {
      fontSize: FONT_SIZES.base,
      color: 'rgba(255,255,255,0.92)',
      marginTop: SPACING.sm,
      lineHeight: 22,
    },
    heroCaption: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: FONT_SIZES.sm,
      marginTop: SPACING.sm,
    },
    cardContainer: {
      marginBottom: SPACING.xl,
    },
    card: {
      ...SHADOWS.md,
    },
    portalToggleContainer: {
      marginBottom: SPACING.xl,
    },
    forgotPasswordLink: {
      textAlign: 'center',
      fontSize: FONT_SIZES.sm,
      color: getAccentColor(),
      fontWeight: FONT_WEIGHTS.semibold,
      marginTop: SPACING.md,
      marginBottom: SPACING.lg,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.lg,
    },
    signupText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
    },
    signupLink: {
      fontSize: FONT_SIZES.sm,
      color: getAccentColor(),
      fontWeight: FONT_WEIGHTS.bold,
    },
    helperRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.md,
      gap: SPACING.md,
    },
    helperText: {
      color: COLORS.textLight,
      fontSize: FONT_SIZES.xs,
      flex: 1,
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={portalType === 'TUTOR' ? ['#0FA3B1', '#163A6F'] : ['#163A6F', '#0F274A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.logoBubble}>
              <Text style={{ fontSize: 28 }}>🐾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appName}>Fidelis</Text>
              <Text style={styles.heroCaption}>
                Portal {portalType === 'TUTOR' ? 'do Tutor' : 'do Veterinário'}
              </Text>
            </View>
          </View>
          <Text style={styles.tagline}>
            Cuide de quem você ama com informações claras, lembretes e histórico clínico sempre à mão.
          </Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <View style={styles.portalToggleContainer}>
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
              style={{ marginTop: SPACING.lg }}
            />

            <Text style={styles.forgotPasswordLink}>Esqueci minha senha</Text>

            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                Acesso mockado para demonstração. Não há autenticação real.
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem conta?</Text>
          <Text
            style={styles.signupLink}
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