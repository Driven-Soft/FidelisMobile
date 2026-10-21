# 🐾 FidelisMobile

**Cuide de quem você ama, do jeito certo.**

Aplicativo de saúde pet desenvolvido pela **Driven Soft** para o **Challenge FIAP 2026 — Sprint 3**, em parceria com a **CLYVO VET**.

## 🎯 Problema e solução

O acompanhamento da saúde de um pet envolve vacinas, retornos, medicamentos e outros cuidados que podem se perder entre anotações e compromissos do dia a dia. A falta de uma visão organizada dificulta a continuidade do cuidado e a comunicação entre tutores e clínicas.

O **FidelisMobile** reúne essas informações em dois portais conectados a uma API .NET: o veterinário cadastra os pets da clínica e organiza seus cuidados, enquanto o tutor acompanha os dados dos seus animais e o que precisa ser feito.

## ✨ Funcionalidades

| Portal do Tutor 🐶 | Portal do Veterinário 🩺 |
| --- | --- |
| Cadastro, login e sessão persistida | Login e sessão persistida |
| Consulta dos seus pets cadastrados pela clínica | Cadastro, consulta, edição e exclusão dos pets da própria clínica |
| Acompanhamento das atualizações de pets e cuidados | Seleção de tutor já cadastrado e vínculo automático do pet à clínica profissional |
| Visualização dos cuidados, datas e status | Cadastro, edição, conclusão, cancelamento e exclusão de cuidados |
| Consulta do perfil e histórico disponível na Home | Agenda de cuidados organizada por status |

Os dados são obtidos da API. A interface apresenta estados de carregamento, erros e atualização após as operações. Os cuidados são lembretes com datas previstas, não agendamentos de consultas confirmadas.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
| --- | --- |
| React Native 0.86 + Expo 57 | Desenvolvimento e execução do aplicativo |
| React 19 | Interface e componentes |
| React Navigation | Navegação entre telas com Stack e Tabs |
| TanStack React Query | Consultas, mutations, cache e atualização dos dados |
| Axios | Requisições HTTP à API .NET |
| AsyncStorage | Persistência da sessão, sem armazenar senha |
| TypeScript | Interface, lógica e contratos (migração estrutural; tipagem completa em etapa posterior) |
| NativeWind + Tailwind CSS | Estilização |
| Expo Font + IBM Plex | Tipografia |

A organização segue o fluxo:

```text
Tela → Hook / TanStack Query → Repository → Axios → API .NET
```

## 🚀 Como executar

### 1. Pré-requisitos

- Node.js 20.19.4 ou superior, compatível com as dependências do projeto, e npm.
- API .NET em execução e acessível pelo navegador ou dispositivo.
- Navegador para testar na web, ou dispositivo/emulador compatível com o Expo.

### 2. Baixar e instalar

```bash
git clone https://github.com/Driven-Soft/FidelisMobile.git
cd FidelisMobile
npm install
```

### 3. Configurar a API

Crie `.env.local` na raiz, seguindo `.env.example`, e informe a URL base da API:

```dotenv
EXPO_PUBLIC_API_URL=http://rm564723-fidelis-api.azurewebsites.net
```

Para a API local na porta 8080, testando no navegador do mesmo computador:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:8080
```

Use **uma única URL**, sem `/swagger` ou `/api` no final. Reinicie o Expo após alterar o arquivo.

> 📌 No celular, `localhost` aponta para o próprio aparelho: use um endereço da API acessível pelo dispositivo. Na web, o backend precisa permitir a origem do aplicativo via CORS. Não versione `.env.local` nem coloque senhas ou tokens nas variáveis `EXPO_PUBLIC_*`.

### 4. Iniciar o aplicativo

Para testar na web:

```bash
npm run web
```

As dependências `typescript` e `@types/react` já estão declaradas. Execute `npm run typecheck` para verificar o código TypeScript. A entrada da aplicação é `index.ts`; apenas as configurações de Babel, Metro e Tailwind permanecem JavaScript.

Para testar no celular com **Expo Go compatível com o SDK 57**:

1. No terminal do computador, execute `npx expo login` e entre na sua conta Expo.
2. No aplicativo Expo Go do celular, entre com **a mesma conta Expo**. Essa conta é independente do login de Tutor/Veterinário do Fidelis.
3. Mantenha o computador e o celular na mesma rede e execute `npx expo start --clear` na pasta do projeto. Se o servidor já estiver aberto, encerre-o com `Ctrl+C` antes.
4. Escaneie o QR Code com o Expo Go no Android ou com a câmera no iPhone.

Outras opções:

| Comando | Execução |
| --- | --- |
| `npm start` | Inicia o Expo para escolher a plataforma |
| `npm run android` | Abre no Android conectado ou emulador |
| `npm run ios` | Abre no simulador iOS, disponível no macOS |

### 5. Acessar os portais

- **Tutor:** crie uma conta pelo aplicativo e faça login selecionando “Tutor”.
- **Veterinário:** selecione “Veterinário” e utilize uma conta profissional já cadastrada na API.

O tutor cria sua conta antes de o veterinário cadastrar o pet. O profissional seleciona o tutor e o pet recebe automaticamente a clínica do veterinário. As consultas de pets e lembretes do tutor são atualizadas a cada 30 segundos enquanto observadas pelo aplicativo; não são notificações push. As restrições de perfil e clínica no Mobile não substituem a autorização no backend.

## 🎬 Vídeo de apresentação

▶️ **[Assistir à apresentação no YouTube](https://youtu.be/ki4T3oCGPOM?is=7kQBMDk6DGpW_iaN)**

## 👥 Equipe Driven Soft

| Integrante | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Max Hayashi Batista | 563717 |
| Henrique Cunha Torres | 565119 |
| Lucas da Silva Lima | 562118 |
| Yasmin Nathalin Miranda dos Santos | 561365 |


🔗 **[Repositório do projeto](https://github.com/Driven-Soft/FidelisMobile)**
