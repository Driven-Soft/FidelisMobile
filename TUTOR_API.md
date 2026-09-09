# Tutor — Etapa 11

## Escopo e auditoria

Implementação restrita ao portal Tutor, conforme decisão do usuário. Perfil e histórico da Home ainda consumiam MOCK_TUTOR_PROFILE e MOCK_TUTOR_HISTORY. Pets e Lembretes já utilizavam seus hooks/repositories e continuam intactos. UserContext mantém somente sessão e estado global do portal; não recebeu dados de servidor.

| Área auditada | Resultado |
| --- | --- |
| Perfil Tutor | GET /api/Tutor/{id}, com tutorId da sessão. TutorResponse existente foi reutilizado. |
| Home Tutor | Perfil real compartilhado; pets/lembretes existentes; histórico de consultas e vacinações da API. |
| Clínica do tutor | TutorResponse não possui clinicaId. Não atribuir ao tutor o vínculo de um pet; a interface informa a ausência do vínculo direto. |
| HomeVet | MOCK_VET_PROFILE, MOCK_VET_PATIENTS, MOCK_VET_APPOINTMENTS e MOCK_VET_ALERTS preservados. |
| PatientsVet | MOCK_VET_PATIENTS e persistência dos filtros preservados. |
| PatientRecord | MOCK_VET_PATIENTS e MOCK_VET_PATIENT_RECORDS preservados; removido apenas o fallback para prontuário '1' e tratado paciente/prontuário ausente. |
| AgendaVet | MOCK_VET_APPOINTMENTS preservado. |
| ProfileVet | MOCK_VET_PROFILE preservado. |

## Contratos e fluxo

Tela → hook TanStack Query → repository → src/services/api.js → API .NET.

- GET /api/Tutor/{id}: 200 TutorResponse; 404 se não encontrado. O ID é exclusivamente o tutorId da sessão, conferido também na resposta.
- GET /api/Consulta: 200 ConsultaResponse[].
- GET /api/Vacinacao: 200 VacinacaoResponse[].

Os contratos clínicos foram lidos em ConsultaDtos.cs e VacinacaoDtos.cs. Não há parâmetros de filtro inventados. As listagens clínicas retornam todos os registros; os hooks filtram por petId dos pets do tutor antes de armazenar o resultado no cache. Isso limita o fluxo Mobile e não constitui autorização no servidor: registros de outros usuários ainda trafegam na resposta. A autorização por propriedade permanece pendente no backend.

O histórico mostra até três registros de consultas/vacinações, ordenados por data, excluindo datas futuras. Não afirma que uma consulta ocorreu ou foi concluída: ConsultaResponse não possui esse status. Campos ausentes, como observações, não são preenchidos com texto clínico fictício. IDs de apresentação têm prefixo da origem para evitar colisões entre consulta e vacinação.

O evento mock 'Novo lembrete criado' não foi reproduzido: LembreteResponse não fornece data de criação; dataPrevista não equivale a ela. Os próximos cuidados continuam usando a integração da Etapa 10.

## Estado, erros e atualização

Perfil e histórico usam chaves com tutorId e expiraEm; o histórico também inclui os IDs ordenados dos pets. Os nomes dos pets são derivados da query existente, de modo que renomear um pet atualiza sua identificação na Home. Mudanças no conjunto de pets alteram a chave do histórico. Não foi necessário modificar as mutations dos CRUDs anteriores.

As novas consultas têm loading, erro visível, refetch e estado vazio quando aplicável. Erros não recorrem a mocks nem exibem dados antigos do perfil como se fossem uma resposta válida. Perfil ausente é exibido como erro 404; logout continua disponível. Há verificação da validade da sessão e descarte de respostas após troca de sessão/desmontagem.

O perfil apresenta nome, email, telefone e CPF reais. A Home usa o mesmo perfil para a saudação. O botão de edição preexistente, que não executava ação, está explicitamente indisponível nesta etapa; não foi implementado CRUD de tutor. Não há escrita nova na API ou persistência adicional.

## Mocks e pendências

MOCK_TUTOR_PROFILE e MOCK_TUTOR_HISTORY deixaram de ser consumidos pelas telas. Nenhum arquivo de dados foi apagado. MOCK_TUTOR_PETS, MOCK_TUTOR_REMINDERS e MOCK_PET_RECORDS também permanecem declarados, sem alimentar os fluxos integrados.

Mocks ainda consumidos: MOCK_VET_PROFILE, MOCK_VET_PATIENTS, MOCK_VET_APPOINTMENTS, MOCK_VET_ALERTS e MOCK_VET_PATIENT_RECORDS. Eles preservam as telas do portal veterinário, cuja integração foi explicitamente adiada.

**Pendência profissional:** AuthService autentica exclusivamente tutores. A sessão não fornece veterinarioId nem identidade profissional. Integrar perfil, pacientes, agenda e prontuário do veterinário depende de um contrato de autenticação profissional real. Não interpretar tutorId como veterinarioId, selecionar um profissional fixo ou habilitar o portal com parâmetros de navegação. O portal veterinário não é acessível pelo login atual. A correção de ausência em PatientRecord é independente dessa identidade e não integra o portal.

Backend, autenticação, Axios/Bearer, rotas, .env.local, dados antigos do AsyncStorage e CRUDs de Pets/Lembretes foram preservados. A integração clínica desta etapa atende somente ao histórico da Home, sem ampliar as abas do perfil do pet para um novo prontuário.

## Verificações e testes manuais pendentes

Passaram sintaxe Babel/imports de 52 arquivos, TypeScript estrito dos novos modelos/repositories/utilitários, checagem dos hooks/componente com noImplicitAny=false (limitação preexistente das declarações React), git diff --check e verificações em memória de endpoints, identidade, 404/erros, isolamento de sessão, filtro clínico, lista vazia, nomes atualizados e chaves por pets. Essas verificações não equivalem a testes reais da API ou validação visual.

Checklist acumulado, apenas para alterações e regressões desta etapa:

- Perfil: carregar nome/email/telefone/CPF do tutor autenticado e comparar com a API; loading, refetch, falha de rede/HTTP e 404 sem fallback fictício.
- Home: saudação do mesmo perfil; pets e próximos cuidados reais; histórico de consultas/vacinas somente dos pets atuais, ordenação e ausência de registros futuros.
- Histórico: lista vazia, tutor sem pets, erro na consulta de pets ou em qualquer fonte clínica, recuperação por Atualizar histórico.
- Navegação: Home → Pets → detalhe real → Lembretes → Perfil, mantendo a sessão e os parâmetros existentes.
- CRUDs: cadastrar/renomear/excluir pet e conferir contagem, nomes e histórico; criar/editar/concluir/cancelar/excluir lembrete e conferir próximos cuidados, conforme checklists anteriores.
- Sessão: válida, inválida/expirada, logout disponível mesmo com erro de perfil, troca de tutor e resposta atrasada sem mistura de dados.
- PatientRecord: quando houver ambiente de teste desse portal, abrir ID ausente/sem prontuário e conferir mensagem e Voltar, sem usar o prontuário '1'. Não habilitar acesso profissional fictício para testar.

Não foram executados testes manuais ou requisições reais nesta etapa. Os testes reais das etapas anteriores continuam pendentes; o último impedimento informado no Web era CORS.
