# Lembretes — Etapa 10

## Integração

Fluxo: RemindersScreen/NewReminderModal/HomeTutor → hooks TanStack Query → reminderRepository → instância Axios existente → API .NET. A base continua em EXPO_PUBLIC_API_URL e o Bearer Token utiliza o mecanismo da Etapa 8, sem alterações.

| Operação | Método e rota | Resultado esperado |
| --- | --- | --- |
| Listar | GET /api/Lembrete | 200, lista de LembreteResponse |
| Carregar edição e conferir propriedade | GET /api/Lembrete/{id} | 200, LembreteResponse; 404 se ausente |
| Criar | POST /api/Lembrete | 201, LembreteResponse |
| Editar tipo e descrição | PUT /api/Lembrete/{id} | 200, LembreteResponse |
| Concluir ou cancelar | PATCH /api/Lembrete/{id} | 200, LembreteResponse |
| Excluir definitivamente | DELETE /api/Lembrete/{id} | 204, sem leitura de corpo |

POST envia somente tipo, descricao, dataPrevista, tutorId da sessão e petId real. Antes do POST, o hook consulta o pet e confere sua propriedade. Tipo é texto livre obrigatório de até 50 caracteres, conforme o DTO; as opções visuais são sugestões. Descrição é obrigatória. Não há campo título no contrato.

PUT envia o LembreteRequest completo, preservando exatamente dataPrevista, tutorId e petId obtidos por GET. O backend só atualiza tipo e descricao; o formulário não oferece alteração de pet ou data. Não há uma nova tela de detalhe: GET por ID atende ao carregamento da edição e às verificações anteriores às mutations.

PATCH de conclusão envia exclusivamente `{ "status": "C" }`; cancelamento envia exclusivamente `{ "status": "X" }`. Cancelados permanecem visíveis em seu grupo. Nenhuma dessas ações utiliza DELETE. Novos registros recebem P no backend. Não há reabertura implementada.

## Datas, estado e interface

O formulário seleciona um dia civil. A adaptação centralizada envia YYYY-MM-DDT00:00:00, sem conversão UTC que desloque esse dia. A exibição utiliza a parte de data da resposta; a edição preserva inclusive o horário original no body do PUT. No navegador, o formulário permite digitar AAAA-MM-DD; nas plataformas nativas, mantém o seletor existente. Datas de calendário inválidas são rejeitadas.

As listas vêm exclusivamente do React Query. Query keys incluem recurso, tutorId e expiraEm da sessão; a chave de detalhe inclui o ID. Cada mutation atualiza o cache de detalhe e invalida a lista da sessão, compartilhada com a Home. Não há cópia da lista em useState, persistência adicional ou fallback mock. Respostas de consultas iniciadas por uma sessão anterior são recusadas pelo hook.

Loading inicial, atualização da lista, erro e estado vazio são distintos. Mutations exibem progresso, desabilitam ações e mantêm os formulários/confirmadores abertos em caso de erro. A confirmação de cancelamento/exclusão funciona dentro da interface, inclusive no navegador. Há tratamento de erro de conexão e respostas 400, 401, 403, 404 e 5xx; o interceptor existente continua responsável pelo 401 da sessão.

O estado local de lembretes e seus efeitos no UserContext foram retirados. Os dados antigos no AsyncStorage não foram apagados nem migrados. Persistência de sessão e demais funcionalidades não foram alteradas. Os arquivos de mocks foram preservados, mas não alimentam lembretes nas telas integradas. A animação que retirava o card antes de uma alteração local foi substituída pela atualização após a mutation; o layout de cards, filtros e botão flutuante foi mantido.

## Limitação de autorização — pendência do backend

O Mobile filtra a listagem por tutorId e confere o tutorId/id do DTO antes de disponibilizar a edição e antes de PUT, PATCH e DELETE, por um novo GET. No cadastro, também confere o pet selecionado.

**Isso é uma restrição de interface/fluxo, não segurança ou autorização.** A listagem sem filtro no servidor continua transmitindo registros de outros tutores. Chamadas diretas e clientes modificados podem contornar as verificações, e a conferência anterior à mutation não garante a propriedade no momento da escrita.

Permanece pendente implementar no backend autorização por identidade autenticada em todas as operações, filtro da listagem e validação do vínculo tutor/pet/lembrete, sem confiar nos IDs enviados pelo cliente. Nenhum arquivo do backend foi alterado nesta etapa.

## Verificações e checklist manual acumulado

Verificações sem rede: sintaxe Babel e imports locais, TypeScript estrito de repository/utilitários, checagem de hooks/componente com noImplicitAny=false devido à ausência preexistente das declarações React, git diff --check e execução simulada de contratos/payloads, propriedade, cache/invalidação, erros, troca de sessão e datas. Essas simulações não equivalem a testes reais da API nem à validação visual no dispositivo.

Testes manuais da Etapa 10 a executar posteriormente:

- Login real e listagem somente dos lembretes do tutor na Home e na tela Lembretes; estado vazio sem mocks.
- Cadastro com pet real do tutor, descrição, tipo e data; conferir POST 201 e status P.
- Conferir o dia escolhido no navegador e no dispositivo, inclusive perto da virada do dia e em outro fuso.
- Abrir edição por GET e salvar tipo/descrição por PUT; conferir que data, tutor e pet permanecem iguais.
- Concluir por PATCH com somente status C; verificar o grupo de concluídos e atualização da Home.
- Cancelar por PATCH com somente status X; verificar que o registro continua existente e visível como cancelado.
- Excluir com confirmação e DELETE 204; conferir remoção da lista e atualização da Home.
- Verificar filtros, tipo personalizado, loading, desabilitação de cliques repetidos e recuperação de erro sem perder o formulário.
- Verificar falha de rede/CORS, 400, 401, 403, 404 e 5xx, inclusive recurso removido após abrir a edição.
- Conferir que pet/lembrete de outro tutor é recusado pelo fluxo Mobile, sem interpretar isso como autorização do servidor.
- Logout/login com outro tutor, expiração e respostas em andamento: conferir ausência de mistura visual entre sessões.
- Confirmar que registros antigos do AsyncStorage não são exibidos como dados da API nem migrados automaticamente.

Os testes reais de autenticação/sessão e Pets das etapas anteriores continuam pendentes. Não foram executados testes manuais agora, conforme solicitado; o último impedimento informado no ambiente Web era CORS.
