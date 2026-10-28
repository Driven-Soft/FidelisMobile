import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  CadastroTutor: undefined;
  Tabs: NavigatorScreenParams<TutorTabParamList> | NavigatorScreenParams<VetTabParamList> | undefined;
};

type PetDetailParamList = { PetProfile: { petId: number; reminderId?: number } };

export type TutorHomeStackParamList = PetDetailParamList & {
  HomeTutorScreen: undefined;
  RemindersTutorScreen: undefined;
};
export type TutorPetsStackParamList = PetDetailParamList & {
  PetsTutorScreen: undefined;
};
export type TutorRemindersStackParamList = { RemindersScreenStack: undefined };
export type TutorProfileStackParamList = { ProfileTutorScreen: undefined; About: undefined };
export type TutorTabParamList = {
  Home: NavigatorScreenParams<TutorHomeStackParamList> | undefined;
  Pets: NavigatorScreenParams<TutorPetsStackParamList> | undefined;
  Reminders: NavigatorScreenParams<TutorRemindersStackParamList> | undefined;
  Profile: NavigatorScreenParams<TutorProfileStackParamList> | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type CadastroTutorScreenProps = NativeStackScreenProps<RootStackParamList, 'CadastroTutor'>;
export type HomeTutorScreenProps = NativeStackScreenProps<TutorHomeStackParamList, 'HomeTutorScreen'>;
export type PetsTutorScreenProps = NativeStackScreenProps<TutorPetsStackParamList, 'PetsTutorScreen'>;
export type NewPetScreenProps = NativeStackScreenProps<VetPatientsStackParamList, 'NewPet'>;
// A mesma tela é registrada nos stacks Início e Meus Pets.
export type PetProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<PetDetailParamList, 'PetProfile'>,
  BottomTabScreenProps<TutorTabParamList>
>;

type PatientRecordParamList = { PatientRecord: undefined };
export type VetHomeStackParamList = PatientRecordParamList & {
  HomeVetScreen: undefined;
  AgendaVet: undefined;
};
export type VetPatientsStackParamList = PatientRecordParamList & { PatientsScreen: undefined; NewPet: { petId?: number } | undefined };
export type PatientsVetScreenProps = NativeStackScreenProps<VetPatientsStackParamList, "PatientsScreen">;
export type VetAgendaStackParamList = PatientRecordParamList & { AgendaVetScreen: undefined };
export type VetProfileStackParamList = { ProfileVetScreen: undefined; About: undefined };
export type VetTabParamList = {
  Dashboard: NavigatorScreenParams<VetHomeStackParamList> | undefined;
  Patients: NavigatorScreenParams<VetPatientsStackParamList> | undefined;
  Agenda: NavigatorScreenParams<VetAgendaStackParamList> | undefined;
  Profile: NavigatorScreenParams<VetProfileStackParamList> | undefined;
};
export type HomeVetScreenProps = CompositeScreenProps<
  NativeStackScreenProps<VetHomeStackParamList, 'HomeVetScreen'>,
  BottomTabScreenProps<VetTabParamList, 'Dashboard'>
>;
export type PendingVetScreenProps = NativeStackScreenProps<PatientRecordParamList, 'PatientRecord'>;

export type ProfileTutorScreenProps = NativeStackScreenProps<TutorProfileStackParamList, "ProfileTutorScreen">;
export type ProfileVetScreenProps = NativeStackScreenProps<VetProfileStackParamList, "ProfileVetScreen">;
