# FidelisMobile

Aplicativo de gestão de saúde pet desenvolvido pela equipe Driven Soft para o Challenge FIAP 2026, em parceria com a CLYVO VET.

## Funcionalidades

O portal Tutor possui integração com a API .NET para cadastro e login, sessão persistida, logout, CRUD de Pets e Lembretes, consulta do perfil e histórico de consultas e vacinações dos pets.

O cadastro envia nome, email, CPF, telefone, endereço e senha. Após o sucesso, o usuário retorna ao login para autenticar. A senha não é persistida no armazenamento local.

O portal Veterinário utiliza o tipo e a identidade retornados pela autenticação para consultar o perfil profissional, sua clínica e os pets vinculados a ela. A listagem compara o clinicaId de cada pet com o clinicaId do veterinário; não depende de vínculo direto entre Tutor e Clínica. Agenda e prontuário exibem uma mensagem de indisponibilidade, sem dados simulados.

## Tecnologias

- Expo 54, React 19 e React Native 0.81.
- React Navigation para Stack e Tabs.
- TanStack React Query para dados de servidor, loading, erros e atualização das consultas.
- Axios como cliente HTTP centralizado.
- AsyncStorage para persistência de sessão.
- JavaScript/JSX e contratos em TypeScript.
- NativeWind, Tailwind CSS, Expo Font e fontes IBM Plex.

## Como executar

Utilize Node.js compatível com Expo 54 e React Native 0.81. O CLI do Expo é executado pelas dependências do projeto.

```bash
git clone https://github.com/Driven-Soft/FidelisMobile.git
cd FidelisMobile
npm install
```

Crie `.env.local` na raiz seguindo `.env.example`:

```dotenv
EXPO_PUBLIC_API_URL=http://rm564723-fidelis-api.azurewebsites.net
```

Use somente a URL base, sem `/swagger`. Não versione `.env.local` e não coloque senhas ou tokens em variáveis `EXPO_PUBLIC_*`. Reinicie o Expo após alterar o ambiente.

Para executar na web:

```bash
npm run web
```

Outras opções:

```bash
npm start
npm run android
npm run ios
```

Android/iOS exigem dispositivo ou emulador compatível. O simulador iOS requer macOS.

## Arquitetura

```text
Tela → Hook / TanStack Query → Repository → Axios → API .NET
```

```text
FidelisMobile/
├── App.js
├── app.json
├── assets/
└── src/
    ├── components/    # Componentes de interface
    ├── config/        # QueryClient compartilhado
    ├── context/       # Sessão e estado global de interface
    ├── hooks/         # Autenticação e operações com React Query
    ├── models/        # Tipos e contratos da API
    ├── repositories/  # Acesso à API e armazenamento de sessão
    ├── routes/        # Navegadores e rotas explícitas
    ├── screens/       # Login, cadastro e portais Tutor/Veterinário
    ├── services/      # Axios e token em memória
    └── utils/         # Validação, formatação e transformação
```

O cliente `src/services/api.js` lê `EXPO_PUBLIC_API_URL` e envia o Bearer Token da sessão. Os dados de servidor ficam sob responsabilidade do React Query. A sessão persiste `token`, `expiraEm`, `tipo`, `tutorId`, `veterinarioId`, `nome` e `email`, sem senha. O ID aplicável depende do tipo autenticado. Sessões antigas sem tipo exigem novo login.

## Integração e limitações

- Cadastro: `POST /api/Tutor`. Login: `POST /api/Auth/login`.
- Para executar na web, a API precisa permitir a origem do aplicativo via CORS; não há contorno de CORS no cliente. A validação em um ambiente local não substitui a validação da API hospedada.
- Recuperação de senha ainda não está implementada.
- Pets exigem `fotoUrl` e sexo `M` ou `F`. O cadastro permite selecionar uma clínica obtida da API e exige confirmar o aviso de que o vínculo não poderá ser alterado pelo aplicativo. Peso e observações não pertencem ao contrato. A edição de `clinicaId` não é oferecida porque o backend ignora essa alteração.
- Lembretes permitem editar tipo/descrição, preservando data e vínculos. Concluir/cancelar altera o status; cancelar não exclui o registro.
- O perfil do tutor não fornece vínculo direto com clínica. O histórico utiliza consultas e vacinações dos pets atuais.
- A autorização por propriedade permanece uma pendência do backend. Filtros e verificações no Mobile limitam a interface, mas não garantem autorização nem impedem chamadas diretas à API.
- Dados legados de pets/lembretes no AsyncStorage não são utilizados ou migrados. Senhas eventualmente gravadas por versões antigas não são removidas automaticamente.

Verificações estáticas e simulações locais não substituem testes reais de cadastro, login, sessão, CRUDs e navegação com a API.

## Equipe

| Integrante | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Max Hayashi Batista | 563717 |
| Henrique Cunha Torres | 565119 |
| Lucas da Silva Lima | 562118 |
| Yasmin Nathalin Miranda dos Santos | 561365 |

## Links

- [Repositório](https://github.com/Driven-Soft/FidelisMobile)
- [Vídeo pitch](https://youtu.be/oG82EtRA0-g)
