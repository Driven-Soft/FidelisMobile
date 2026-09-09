# Fidelis

Cuide de quem você ama, do jeito certo.

---

## Sobre o Projeto

Fidelis é um aplicativo móvel de gestão de saúde pet criado para o Challenge FIAP 2026 em parceria com a CLYVO VET. O app resolve um problema recorrente no mercado brasileiro: muitos tutores só se conectam com a clínica veterinária em situações de emergência ou diante de gatilhos evidentes como vacinação. Com uma jornada contínua, proativa e personalizada, o Fidelis promove a continuidade do cuidado e conecta tutores e veterinários em torno de um histórico clínico longitudinal estruturado.

---

## Funcionalidades

### Estado atual da integração

O portal Tutor utiliza autenticação real, sessão persistida, CRUD de Pets e Lembretes, perfil e histórico de consultas/vacinações via API .NET. O acesso segue Tela → Hook TanStack Query → Repository → Axios. A URL é definida por `EXPO_PUBLIC_API_URL`; o token é enviado pelo cliente Axios centralizado.

O portal Veterinário permanece com mocks e não é disponibilizado pelo login atual: sua integração depende de autenticação profissional que forneça a identidade do veterinário. As funcionalidades listadas abaixo incluem a interface planejada, não apenas operações já integradas.

Limitações a considerar na entrega:

- O cadastro local não cria uma conta no backend. A integração de cadastro, recuperação de senha e edição do perfil ainda está pendente.
- Pets exigem fotoUrl e sexo M/F; peso e observações não pertencem ao contrato de Pet. A edição de clinicaId é ignorada pelo backend e não é oferecida.
- Lembretes permitem editar tipo/descrição. Data, tutor e pet são preservados no PUT; concluir/cancelar envia somente status C/X por PATCH. Cancelar não exclui o registro.
- TutorResponse não fornece vínculo direto com clínica. O histórico da Home mostra consultas/vacinações vinculadas aos pets atuais, sem inferir conclusão de consulta ou data de criação de lembrete.
- **Autorização por propriedade é uma pendência do backend.** Listagens podem transmitir dados de outros tutores; os filtros e verificações do Mobile limitam a interface, mas não impedem chamadas diretas. O backend precisa autorizar cada operação pela identidade autenticada e validar os vínculos entre tutor, pet e registros.
- Dados antigos de pets/lembretes no AsyncStorage não são lidos nem migrados. A sessão persiste apenas token, expiraEm, tutorId e nome. Senhas legadas eventualmente já gravadas não foram removidas automaticamente.

### Validação pendente

As verificações de sintaxe, imports, TypeScript e simulações locais realizadas durante o desenvolvimento não substituem testes reais da API. A checagem dos hooks teve limitação preexistente pela ausência das declarações React. O último impedimento informado no navegador era CORS.

Checklist para a validação final:

- Login, restauração de sessão, expiração, logout e troca de tutor, inclusive com requisições em andamento.
- CRUD completo de Pets e Lembretes, confirmação de exclusão, status C/X e atualização automática da Home, listas, contagens e detalhes.
- Perfil real, perfil não encontrado (404), histórico filtrado pelos pets do tutor e navegação entre Home, Pets, Lembretes e Perfil.
- Loading, refetch, listas vazias sem mocks, falha de rede/CORS, erros HTTP e bloqueio de submissões duplicadas.
- Datas de nascimento, lembretes e histórico no navegador/dispositivo e em diferentes fusos.
- Cadastro legado sem habilitar login real; registros antigos locais sem sobrescrever a API; verificar ausência de senha em novas gravações locais.
- Quando houver ambiente profissional apropriado, paciente/prontuário ausente deve mostrar mensagem e permitir voltar, sem fallback para o registro fictício '1'.

### Portal do Tutor

- 🐾 Cadastro e login de tutor
- 🐾 Visualização do perfil do pet e histórico de saúde
- 🐾 Gestão de consultas e lembretes de cuidados
- 🐾 Cadastro de novos pets e acompanhamento personalizado
- 🐾 Acesso à jornada de saúde do pet em um só lugar

### Portal do Veterinário

- 🩺 Agenda de atendimentos e pacientes
- 🩺 Lista de clientes e pets vinculados
- 🩺 Acompanhamento do histórico clínico longitudinal
- 🩺 Registro de prontuário e detalhes do paciente
- 🩺 Gestão de consultas e comunicação com tutores

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| Expo | ~54.0.37 | Plataforma de desenvolvimento mobile React Native |
| React | 19.1.0 | Biblioteca de interface de usuário |
| React Native | 0.81.5 | Framework para apps móveis nativos |
| React Navigation | 7.x | Navegação entre telas e abas |
| @react-native-async-storage/async-storage | 2.2.0 | Armazenamento local de dados |
| @expo/vector-icons | ^15.0.3 | Ícones Feather usados na interface |
| expo-font | ~14.0.12 | Carregamento das fontes do app |
| @expo-google-fonts/ibm-plex-sans | ^0.4.1 | Tipografia de interface (IBM Plex Sans) |
| @expo-google-fonts/ibm-plex-mono | ^0.4.1 | Tipografia de números e datas (IBM Plex Mono) |
| expo-navigation-bar | ~5.0.10 | Personalização da barra de navegação no Android |
| expo-status-bar | ~3.0.9 | Controle da barra de status do sistema |
| nativewind | ^4.2.3 | Estilização Tailwind para React Native |
| tailwindcss | ^3.4.17 | Utilitários CSS para interface e web |
| react-native-gesture-handler | ~2.28.0 | Gestos e interações de toque |
| react-native-mask-input | ^1.2.3 | Máscaras de entrada para formulários |
| react-native-reanimated | ~4.1.1 | Animações fluidas e transições |
| react-native-safe-area-context | ~5.6.0 | Respeito às áreas seguras de tela |
| react-native-screens | ~4.16.0 | Otimização de telas e navegação |
| react-native-web | ^0.21.0 | Suporte de execução no web browser |
| prettier-plugin-tailwindcss | ^0.5.11 | Formatação de código com Tailwind CSS |

---

## Estrutura do Projeto

<summary>Árvore de diretórios</summary>
<br>

```
FidelisMobile/
├─ App.js
├─ app.json
├─ babel.config.js
├─ global.css
├─ index.js
├─ metro.config.js
├─ package.json
├─ package-lock.json
├─ tailwind.config.js
├─ assets/                # Recursos estáticos do app
└─ src/                   # Código-fonte principal
   ├─ components/         # Componentes reutilizáveis de interface
   │  ├─ common/          # UI usada pelos dois portais
   │  │  ├─ Avatar.jsx
   │  │  └─ Input.jsx
   │  ├─ Tutor/           # Componentes específicos do portal do tutor
   │  │  ├─ NewReminderModal.jsx
   │  │  ├─ ReminderCard.jsx
   │  │  └─ TutorHeader.jsx
   │  ├─ Veterinario/     # Componentes específicos do portal do veterinário
   │  │  └─ Badge.jsx
   ├─ context/            # Contexto global de aplicação
   │  └─ UserContext.jsx
   ├─ data/               # Dados simulados e mocks
   │  └─ fidelisData.js
   ├─ routes/             # Configuração de navegação
   │  ├─ stack.routes.jsx
   │  ├─ tab.routes.jsx
   │  ├─ tutor.tab.routes.jsx
   │  └─ vet.tab.routes.jsx
   └─ screens/            # Telas do aplicativo
      ├─ Login/           # Fluxo de autenticação
      │  ├─ CadastroTutor.jsx
      │  └─ Login.jsx
      ├─ Tutor/           # Telas do portal do tutor
      │  ├─ HomeTutor.jsx
      │  ├─ NewPet.jsx
      │  ├─ PetProfile.jsx
      │  ├─ PetsTutor.jsx
      │  ├─ ProfileTutor.jsx
      │  └─ RemindersScreen.jsx
      └─ Veterinario/     # Telas do portal do veterinário
         ├─ AgendaVet.jsx
         ├─ HomeVet.jsx
         ├─ PatientRecord.jsx
         ├─ PatientsVet.jsx
         └─ ProfileVet.jsx
```

---

## Como Executar

### Pré-requisitos

- Node.js 18.x ou superior
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- Emulador Android/iOS ou dispositivo físico com o Expo Go instalado

### Passo a passo

```bash
git clone https://github.com/Driven-Soft/FidelisMobile.git
cd FidelisMobile
npm install
npm start
```

Para rodar diretamente em um emulador ou dispositivo:

```bash
npm run android
# ou
npm run ios
# ou
npm run web
```

---

## Equipe Driven Soft

## Integrantes

| Nome | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Max Hayashi Batista | 563717 |
| Henrique Cunha Torres | 565119 |

## Link do Vídeo Pitch:

* [https://youtu.be/oG82EtRA0-g](https://youtu.be/oG82EtRA0-g)

## Link do Repositório no Github:

* [https://github.com/Driven-Soft/FidelisMobile](https://github.com/Driven-Soft/FidelisMobile)
