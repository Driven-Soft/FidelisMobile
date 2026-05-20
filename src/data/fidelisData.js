export const MOCK_TUTOR_PROFILE = {
  id: 'tutor-1',
  name: 'Ana Souza',
  email: 'ana.souza@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-10',
  clinic: 'Clínica VetCare São Paulo',
  avatarColor: '#0FA3B1',
  initials: 'AS',
};

export const MOCK_VET_PROFILE = {
  id: 'vet-1',
  name: 'Dr. Carlos Mendes',
  email: 'carlos@vetcare.com.br',
  phone: '(11) 3456-7890',
  crmv: 'CRMV-SP 12345',
  specialty: 'Clínica Geral',
  clinic: {
    name: 'Clínica VetCare São Paulo',
    address: 'Rua das Flores, 123 - São Paulo, SP',
  },
  avatarColor: '#163A6F',
  initials: 'CM',
};

export const MOCK_TUTOR_PETS = [
  {
    id: '1',
    name: 'Thor',
    species: 'Cão',
    breed: 'Golden Retriever',
    sex: 'Macho',
    birthDate: '2021-05-15',
    avatar: '🐶',
    color: '#DDF6F3',
    accent: '#0FA3B1',
    clinic: 'Clínica VetCare São Paulo',
  },
  {
    id: '2',
    name: 'Mia',
    species: 'Gato',
    breed: 'Siamês',
    sex: 'Fêmea',
    birthDate: '2023-02-20',
    avatar: '🐱',
    color: '#EEF2FF',
    accent: '#4F46E5',
    clinic: 'Clínica VetCare São Paulo',
  },
  {
    id: '3',
    name: 'Luna',
    species: 'Cão',
    breed: 'Poodle',
    sex: 'Fêmea',
    birthDate: '2020-10-08',
    avatar: '🐾',
    color: '#FFF1D6',
    accent: '#EA8C00',
    clinic: 'Clínica VetCare São Paulo',
  },
];

export const MOCK_TUTOR_REMINDERS = [
  {
    id: '1',
    petId: '1',
    petName: 'Thor',
    type: 'VACINA',
    title: 'Vacina V10',
    description: 'Aplicar reforço anual na próxima consulta.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: '2',
    petId: '2',
    petName: 'Mia',
    type: 'MEDICAMENTO',
    title: 'Antibiótico',
    description: 'Dar a dose da noite após a refeição.',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: '5',
    petId: '2',
    petName: 'Mia',
    type: 'CHECKUP',
    title: 'Check-up anual',
    description: 'Avaliação geral de saúde e exames de rotina.',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: '3',
    petId: '3',
    petName: 'Luna',
    type: 'CONSULTA',
    title: 'Retorno dermatológico',
    description: 'Rever resposta ao tratamento da pele.',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: '4',
    petId: '1',
    petName: 'Thor',
    type: 'RETORNO',
    title: 'Reavaliação',
    description: 'Checar resultado dos exames recentes.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: true,
  },
];

export const MOCK_TUTOR_HISTORY = [
  {
    id: '1',
    petId: '1',
    petName: 'Thor',
    title: 'Vacina V10 aplicada',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'VACINA',
    note: 'Sem reações após 30 minutos de observação.',
  },
  {
    id: '2',
    petId: '2',
    petName: 'Mia',
    title: 'Consulta de retorno',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    type: 'RETORNO',
    note: 'Quadro evoluindo bem com a medicação.',
  },
  {
    id: '3',
    petId: '3',
    petName: 'Luna',
    title: 'Novo lembrete criado',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'MEDICAMENTO',
    note: 'Tratamento agendado para 10 dias.',
  },
];

export const MOCK_PET_RECORDS = {
  '1': {
    vaccines: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Vacina V10',
        observations: 'Dose de reforço aplicada sem intercorrências.',
      },
      {
        id: '2',
        date: new Date('2024-04-20'),
        title: 'Vacina antirrábica',
        observations: 'Paciente tranquilo durante a aplicação.',
      },
    ],
    consultations: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Consulta de rotina',
        observations: 'Exame físico sem alterações importantes.',
      },
      {
        id: '2',
        date: new Date('2025-01-18'),
        title: 'Retorno dermatológico',
        observations: 'Coceira reduzida após ajustes na dieta.',
      },
    ],
    medications: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Omega 3',
        observations: '1 cápsula ao dia por 30 dias.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Peso e escore corporal',
        observations: 'Peso estável, escore corporal ideal.',
      },
    ],
  },
  '2': {
    vaccines: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Quádrupla felina',
        observations: 'Sem reação à vacina.',
      },
    ],
    consultations: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Consulta de retorno',
        observations: 'Respiração normal e comportamento ativo.',
      },
    ],
    medications: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Antibiótico felino',
        observations: '2x ao dia após alimentação.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Check-up geral',
        observations: 'Ganho de peso dentro do esperado.',
      },
    ],
  },
  '3': {
    vaccines: [
      {
        id: '1',
        date: new Date('2025-02-08'),
        title: 'V8 + gripe',
        observations: 'Aplicação preventiva concluída.',
      },
    ],
    consultations: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Avaliação dermatológica',
        observations: 'Pele sensível, ajustar banho e shampoo.',
      },
    ],
    medications: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Pomada dermatológica',
        observations: 'Aplicar nas áreas afetadas 2x ao dia.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Bem-estar geral',
        observations: 'Paciente animada e com bom apetite.',
      },
    ],
  },
};

export const MOCK_VET_PATIENTS = [
  {
    id: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    breed: 'Golden Retriever',
    tutorName: 'Ana Souza',
    tutorPhone: '(11) 98765-4321',
    tutorEmail: 'ana.souza@email.com',
    clinic: 'Clínica VetCare São Paulo',
    lastConsultation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    avatar: '🐶',
    color: '#DDF6F3',
    accent: '#0FA3B1',
  },
  {
    id: '2',
    petName: 'Mia',
    petSpecies: 'Gato',
    breed: 'Siamês',
    tutorName: 'João Silva',
    tutorPhone: '(11) 98888-1222',
    tutorEmail: 'joao.silva@email.com',
    clinic: 'Clínica VetCare São Paulo',
    lastConsultation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    avatar: '🐱',
    color: '#EEF2FF',
    accent: '#4F46E5',
  },
  {
    id: '3',
    petName: 'Max',
    petSpecies: 'Cão',
    breed: 'Bulldog',
    tutorName: 'Maria Santos',
    tutorPhone: '(11) 97777-3344',
    tutorEmail: 'maria.santos@email.com',
    clinic: 'Clínica VetCare São Paulo',
    lastConsultation: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    avatar: '🐾',
    color: '#FFF1D6',
    accent: '#EA8C00',
  },
  {
    id: '4',
    petName: 'Bella',
    petSpecies: 'Cão',
    breed: 'Labrador',
    tutorName: 'Carlos Oliveira',
    tutorPhone: '(11) 96666-2211',
    tutorEmail: 'carlos.oliveira@email.com',
    clinic: 'Clínica VetCare São Paulo',
    lastConsultation: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    avatar: '🐶',
    color: '#FBE4E4',
    accent: '#DC2626',
  },
];

export const MOCK_VET_APPOINTMENTS = [
  {
    id: '1',
    petId: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    tutorName: 'Ana Souza',
    consultationType: 'Rotina',
    time: '09:00',
    date: new Date(),
  },
  {
    id: '2',
    petId: '2',
    petName: 'Mia',
    petSpecies: 'Gato',
    tutorName: 'João Silva',
    consultationType: 'Retorno',
    time: '10:30',
    date: new Date(),
  },
  {
    id: '3',
    petId: '3',
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
    petId: '1',
    petName: 'Thor',
    petSpecies: 'Cão',
    tutorName: 'Ana Souza',
    alertType: 'RETORNO',
    description: 'Retorno vencido há 5 dias',
    urgency: 'high',
  },
  {
    id: '2',
    petId: '4',
    petName: 'Bella',
    petSpecies: 'Cão',
    tutorName: 'Carlos Oliveira',
    alertType: 'VACINA',
    description: 'Vacina vence em 2 dias',
    urgency: 'medium',
  },
];

export const MOCK_VET_PATIENT_RECORDS = {
  '1': {
    petId: '1',
    petName: 'Thor',
    species: 'Cão',
    breed: 'Golden Retriever',
    sex: 'Macho',
    age: '3 anos',
    weight: '28 kg',
    tutorName: 'Ana Souza',
    tutorPhone: '(11) 98765-4321',
    tutorEmail: 'ana.souza@email.com',
    clinic: 'Clínica VetCare São Paulo',
    consultations: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Consulta de rotina',
        observations: 'Exame clínico normal e plano vacinal em dia.',
      },
      {
        id: '2',
        date: new Date('2025-01-18'),
        title: 'Retorno dermatológico',
        observations: 'Boa resposta ao ajuste alimentar.',
      },
    ],
    vaccinations: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Vacina V10',
        observations: 'Sem intercorrências.',
      },
    ],
    prescriptions: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Omega 3 1000mg',
        observations: '1 cápsula ao dia por 30 dias.',
      },
    ],
    exams: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Hemograma completo',
        observations: 'Resultados dentro da normalidade.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-04-20'),
        title: 'Peso corporal',
        observations: 'Peso estável e atividade física adequada.',
      },
    ],
  },
  '2': {
    petId: '2',
    petName: 'Mia',
    species: 'Gato',
    breed: 'Siamês',
    sex: 'Fêmea',
    age: '2 anos',
    weight: '4,5 kg',
    tutorName: 'João Silva',
    tutorPhone: '(11) 98888-1222',
    tutorEmail: 'joao.silva@email.com',
    clinic: 'Clínica VetCare São Paulo',
    consultations: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Consulta de retorno',
        observations: 'Respiração normal e evolução favorável.',
      },
    ],
    vaccinations: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Quádrupla felina',
        observations: 'Paciente cooperativa durante o atendimento.',
      },
    ],
    prescriptions: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Antibiótico felino',
        observations: '2x ao dia após alimentação.',
      },
    ],
    exams: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Raio-X torácico',
        observations: 'Sem alterações agudas.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-03-22'),
        title: 'Bem-estar geral',
        observations: 'Peso estável e boa ingestão hídrica.',
      },
    ],
  },
  '3': {
    petId: '3',
    petName: 'Max',
    species: 'Cão',
    breed: 'Bulldog',
    sex: 'Macho',
    age: '5 anos',
    weight: '24 kg',
    tutorName: 'Maria Santos',
    tutorPhone: '(11) 97777-3344',
    tutorEmail: 'maria.santos@email.com',
    clinic: 'Clínica VetCare São Paulo',
    consultations: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Avaliação dermatológica',
        observations: 'Lesões controladas e acompanhamento sugerido.',
      },
    ],
    vaccinations: [
      {
        id: '1',
        date: new Date('2025-02-08'),
        title: 'V8 + gripe',
        observations: 'Aplicação preventiva concluída.',
      },
    ],
    prescriptions: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Pomada dermatológica',
        observations: 'Aplicar nas áreas afetadas 2x ao dia.',
      },
    ],
    exams: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Citologia de pele',
        observations: 'Processo inflamatório leve.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-04-01'),
        title: 'Bem-estar geral',
        observations: 'Paciente animado e com bom apetite.',
      },
    ],
  },
  '4': {
    petId: '4',
    petName: 'Bella',
    species: 'Cão',
    breed: 'Labrador',
    sex: 'Fêmea',
    age: '4 anos',
    weight: '29 kg',
    tutorName: 'Carlos Oliveira',
    tutorPhone: '(11) 96666-2211',
    tutorEmail: 'carlos.oliveira@email.com',
    clinic: 'Clínica VetCare São Paulo',
    consultations: [
      {
        id: '1',
        date: new Date('2025-03-14'),
        title: 'Consulta preventiva',
        observations: 'Sinais vitais normais, orientação de rotina.',
      },
    ],
    vaccinations: [
      {
        id: '1',
        date: new Date('2025-03-14'),
        title: 'Vacina V10',
        observations: 'Próximo reforço anual.',
      },
    ],
    prescriptions: [
      {
        id: '1',
        date: new Date('2025-03-14'),
        title: 'Probiótico',
        observations: 'Uso por 15 dias.',
      },
    ],
    exams: [
      {
        id: '1',
        date: new Date('2025-03-14'),
        title: 'Ultrassom abdominal',
        observations: 'Sem alterações relevantes.',
      },
    ],
    wellness: [
      {
        id: '1',
        date: new Date('2025-03-14'),
        title: 'Escore corporal',
        observations: 'Em ligeira melhora.',
      },
    ],
  },
};

export const formatPtDate = (date) => {
  const value = date instanceof Date ? date : new Date(date);
  return value.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const parsePtDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      const parsed = new Date(year, month - 1, day);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed;
      }
      return null;
    }
  }

  const fallback = new Date(value);
  if (Number.isNaN(fallback.getTime())) return null;
  return fallback;
};

export const getPetAgeLabel = (birthDate) => {
  const birth = parsePtDate(birthDate);
  if (!birth) return 'Idade desconhecida';
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return `${Math.max(age, 0)} ano${Math.max(age, 0) === 1 ? '' : 's'}`;
};
