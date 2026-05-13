export const MOCK_TUTOR = {
  id: '1',
  name: 'Ana Souza',
  email: 'ana.souza@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-10',
  profileImage: require('../../assets/icon.png'),
};

export const MOCK_VETERINARIAN = {
  id: '1',
  name: 'Dr. Carlos Mendes',
  email: 'carlos@vetcare.com.br',
  phone: '(11) 3456-7890',
  crmv: 'CRMV-SP 12345',
  specialty: 'Clínica Geral',
  clinic: {
    name: 'Clínica VetCare São Paulo',
    address: 'Rua das Flores, 123 - São Paulo, SP',
  },
  profileImage: require('../../assets/icon.png'),
};

export const MOCK_PETS = [
  {
    id: '1',
    name: 'Thor',
    species: 'Cão',
    breed: 'Golden Retriever',
    sex: 'Macho',
    birthDate: '2021-05-15',
    clinicAssociated: 'Clínica VetCare São Paulo',
    profileImage: require('../../assets/icon.png'),
  },
  {
    id: '2',
    name: 'Mia',
    species: 'Gato',
    breed: 'Siamês',
    sex: 'Fêmea',
    birthDate: '2023-02-20',
    clinicAssociated: 'Clínica VetCare São Paulo',
    profileImage: require('../../assets/icon.png'),
  },
];

export const MOCK_REMINDERS = [
  {
    id: '1',
    petId: '1',
    petName: 'Thor',
    type: 'VACINA',
    description: 'Vacina V10',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
    completed: false,
  },
  {
    id: '2',
    petId: '1',
    petName: 'Thor',
    type: 'RETORNO',
    description: 'Retorno pós-consulta',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    completed: false,
  },
  {
    id: '3',
    petId: '2',
    petName: 'Mia',
    type: 'MEDICAMENTO',
    description: 'Medicamento - Antibiótico',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
    completed: false,
  },
];

export const MOCK_VET_APPOINTMENTS = [
  {
    id: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    tutorName: 'Ana Souza',
    consultationType: 'Rotina',
    time: '09:00',
    date: new Date(),
  },
  {
    id: '2',
    petName: 'Mia',
    petSpecies: 'Gato',
    tutorName: 'João Silva',
    consultationType: 'Retorno',
    time: '10:30',
    date: new Date(),
  },
  {
    id: '3',
    petName: 'Max',
    petSpecies: 'Cão',
    tutorName: 'Maria Santos',
    consultationType: 'Emergência',
    time: '14:00',
    date: new Date(),
  },
];

export const MOCK_VET_ALERTS = [
  {
    id: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    tutorName: 'Ana Souza',
    alertType: 'RETORNO',
    description: 'Retorno vencido há 5 dias',
    urgency: 'high',
  },
  {
    id: '2',
    petName: 'Bella',
    petSpecies: 'Cão',
    tutorName: 'Carlos Oliveira',
    alertType: 'VACINA',
    description: 'Vacina vence em 2 dias',
    urgency: 'medium',
  },
];

export const MOCK_VET_PATIENTS = [
  {
    id: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    breed: 'Golden Retriever',
    tutorName: 'Ana Souza',
    lastConsultation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    profileImage: require('../../assets/icon.png'),
  },
  {
    id: '2',
    petName: 'Mia',
    petSpecies: 'Gato',
    breed: 'Siamês',
    tutorName: 'João Silva',
    lastConsultation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    profileImage: require('../../assets/icon.png'),
  },
  {
    id: '3',
    petName: 'Max',
    petSpecies: 'Cão',
    breed: 'Bulldog',
    tutorName: 'Maria Santos',
    lastConsultation: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    profileImage: require('../../assets/icon.png'),
  },
  {
    id: '4',
    petName: 'Bella',
    petSpecies: 'Cão',
    breed: 'Labrador',
    tutorName: 'Carlos Oliveira',
    lastConsultation: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    profileImage: require('../../assets/icon.png'),
  },
];

export const MOCK_VACCINATIONS = [
  {
    id: '1',
    petId: '1',
    name: 'Vacina V10',
    vaccinationDate: new Date('2024-03-15'),
    nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    petId: '1',
    name: 'Raiva',
    vaccinationDate: new Date('2024-02-20'),
    nextDueDate: new Date('2025-02-20'),
  },
];

export const MOCK_CONSULTATIONS = [
  {
    id: '1',
    petId: '1',
    date: new Date('2024-04-10'),
    type: 'Rotina',
    veterinarian: 'Dr. Carlos Mendes',
    diagnosis: 'Paciente em excelente estado de saúde',
    observations: 'Manter vacinação em dia',
  },
  {
    id: '2',
    petId: '1',
    date: new Date('2024-03-15'),
    type: 'Retorno',
    veterinarian: 'Dr. Carlos Mendes',
    diagnosis: 'Limpeza de ouvido realizada com sucesso',
    observations: 'Reavaliar em 2 semanas',
  },
];

export const MOCK_MEDICATIONS = [
  {
    id: '1',
    petId: '1',
    name: 'Antibiótico XYZ',
    dosage: '250mg',
    frequency: '2x ao dia',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-10'),
  },
];

export const MOCK_EXAMS = [
  {
    id: '1',
    petId: '1',
    type: 'Exame de Sangue',
    date: new Date('2024-04-10'),
    description: 'Hemograma completo',
    results: 'Dentro dos limites normais',
  },
];

export const MOCK_WELLNESS = [
  {
    id: '1',
    petId: '1',
    date: new Date('2024-04-10'),
    weight: 28,
    bodyCondition: 'Ideal',
    notes: 'Paciente muito ativo',
  },
];
