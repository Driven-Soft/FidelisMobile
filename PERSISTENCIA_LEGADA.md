# Etapa 12 — persistência legada e consistência

## Inventário do estado atual

| Chave/uso | Classificação | Interferência e decisão |
| --- | --- | --- |
| @fidelis:auth_session | Necessário | Sessão real: token, expiraEm, tutorId e nome. Whitelist na gravação/restauração; nenhuma senha. Preservado. |
| @fidelis:cadastro_tutor | Cadastro local legado | Somente escrita em CadastroTutor; não é lido pelo login, Context, perfil ou sessão. Retirada a senha de novas gravações e corrigida a mensagem que sugeria criação de conta real. Demais campos locais preservados. |
| @fidelis:tutor_pets | Substituído pela API | Sem leitor/escritor atual. Registros antigos não sobrescrevem queries; não foram apagados ou migrados. |
| @fidelis:reminders:… | Substituído pela API | Sem leitor/escritor atual. Nenhuma referência a tutorReminders no fluxo. Registros antigos preservados, sem migração. |
| @fidelis:vetPatientsFilter:{portal}:{owner} | Preferência local temporária | Guarda busca/filtro de pacientes do portal veterinário. Preservado; não armazena dados de servidor do Tutor. A chave usa email/guest no fluxo legado e deve ser revista quando houver identidade profissional real. |

A busca em fontes do projeto não encontrou outros usos de AsyncStorage/localStorage/sessionStorage além desses fluxos ativos. sessionStorage.ts é o repository de sessão, não uso da API sessionStorage do navegador. Dependências não foram alteradas.

## Correção aplicada

CadastroTutor continuava afirmando que uma conta havia sido criada, redirecionando para um login que só aceita credenciais do backend. Além disso, persistia uma senha que nenhum fluxo atual utiliza. A gravação agora inclui somente userType, name, email, phone e cpf. A tela informa desde o início que não cria conta na API, não habilita login e não salva senha. Também deixou de prometer verificação de identidade por CPF, que não é executada pelo formulário local.

O formulário visual e suas validações foram preservados; senha e confirmação ainda existem somente no estado transitório da tela. Não foi criado cadastro remoto nem autenticação alternativa. Valores antigos já presentes no dispositivo não foram lidos nem removidos automaticamente: uma senha legada pode continuar naquela chave até ela ser sobrescrita por uma nova gravação sem senha ou removida separadamente. Isso não concede acesso à aplicação.

## Pets, lembretes, perfil e sessões

UserContext não contém pets, lembretes nem cópia do perfil da API. As telas do Tutor e seus componentes não importam mocks de dados integrados. As queries pets, reminders e tutor-data incluem tutorId e expiraEm; detalhes incluem o ID e histórico inclui os IDs dos pets. Não foi encontrada reutilização da chave do tutor A pelo tutor B.

Logout retira o token do transporte, limpa o estado da sessão e remove a chave persistida; as rotas protegidas são desmontadas. Consultas recusam respostas após troca de sessão/desmontagem. Mutations atualizam e invalidam suas próprias chaves; uma resposta atrasada fica no escopo antigo, sem substituir dados de B. O cache antigo pode permanecer temporariamente em memória até a coleta do React Query: isolamento visual entre tutores não equivale a apagar todos os dados da memória. Não foi aplicada limpeza indiscriminada do QueryClient.

Pets: criar invalida a lista; editar atualiza detalhe e invalida o escopo; excluir marca detalhe ausente e invalida a lista. Lembretes: criar/editar/status/excluir atualizam detalhe e invalidam a lista. Home e contagens usam essas mesmas queries. Não foi necessário alterar CRUDs, contratos, endpoints, sessão, Axios ou navegação.

## Datas e pendências anteriores

- Nascimento do pet e data de lembrete usam representação civil, sem misturar Date de mocks com respostas da API. PUT de lembretes preserva a data original; formulário serializa datas em camada utilitária. Nenhuma migração de datas locais é feita.
- Histórico usa os campos de data confirmados dos DTOs; expiração continua seguindo UTC/Z do AuthService. Não foi identificada uma correção de persistência que exigisse alterar esses formatos nesta etapa. Os testes reais em dispositivos/fusos continuam pendentes.
- Login fictício, pets/lembretes no Context e perfis fictícios do Tutor foram resolvidos nas etapas anteriores.
- Cadastro real, edição do perfil, funcionalidades clínicas adicionais e recuperação de senha continuam pendentes; não foram implementados nesta revisão.
- A limitação de autorização por propriedade no backend continua registrada em PETS_API.md, LEMBRETES_API.md e TUTOR_API.md; filtro Mobile não constitui autorização.
- Portal Veterinário e seus mocks permanecem por decisão de escopo, até existir identidade/autenticação profissional. Filtros e funcionalidades desse portal não foram refatorados.
- README/vídeo e testes reais da entrega não foram tratados como correções de persistência.

## Verificações e testes manuais

Verificações sem rede: sintaxe/imports, TypeScript com a limitação preexistente dos tipos React, git diff --check, busca de referências residuais, execução do salvamento local com armazenamento simulado, whitelist da sessão e isolamento das chaves de cache. Simulações não equivalem a testes reais da API.

Testes manuais pendentes:

1. Abrir o cadastro legado, conferir a indicação de que não cria conta real e salvar; verificar que a chave local não contém password/confirmPassword/senha. Não compartilhar senhas ou tokens.
2. Confirmar que salvar localmente não autentica, não substitui perfil da API e não torna novas credenciais válidas no login.
3. Tutor A: usar Pets/Lembretes, sair, entrar como B e conferir Home, Perfil, listas e detalhes sem dados de A; repetir com requisição em andamento.
4. Restaurar sessão válida e expirada; conferir logout e retorno ao login. Simular falha de remoção da sessão apenas em ambiente de teste e conferir a mensagem existente.
5. Manter registros antigos de pets/lembretes no dispositivo e conferir que não aparecem nem sobrescrevem a API, inclusive com lista vazia/erro HTTP.
6. Reexecutar CRUDs e conferir atualização da Home; conferir datas de nascimento/lembrete e histórico no navegador/dispositivo e em outro fuso.

Nenhuma requisição real ou teste manual foi executado nesta etapa. Dados do dispositivo, backend, .env.local e alterações preexistentes do package-lock.json foram preservados.
