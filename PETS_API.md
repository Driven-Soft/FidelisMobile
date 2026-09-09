# Pets — Etapa 9

Fluxo: tela → hooks TanStack Query → petRepository → instância Axios existente → API .NET.

Operações implementadas: GET /api/Pet (200), GET /api/Pet/{id} (200), POST /api/Pet (201), PATCH /api/Pet/{id} (200) e DELETE /api/Pet/{id} (204, sem corpo). A edição usa PATCH; PUT não é utilizado.

O formulário envia nome, especie, raca, sexo (M/F), dataNascimento e fotoUrl obrigatória. O cadastro acrescenta tutorId da sessão. Peso e observações não fazem parte do contrato. Não há edição de clinicaId, pois o backend ignora sua atualização.

## Restrição temporária de propriedade

- A listagem é filtrada por tutorId após a resposta da API.
- O detalhe só é disponibilizado após conferir tutorId e id da resposta.
- Antes de PATCH e DELETE, um novo GET verifica a propriedade disponível no DTO.
- O cache é separado por tutor e expiração da sessão. As mutations atualizam e invalidam as consultas relacionadas.

Essas verificações são restrições de interface e fluxo, **não autorização ou segurança**. GET /api/Pet continua transmitindo pets de outros tutores ao cliente. Um cliente modificado ou uma chamada direta pode contornar os controles. A verificação anterior à alteração também não garante propriedade no momento da operação.

**Pendência de segurança no backend:** derivar o tutor da identidade autenticada e autorizar listagem, leitura, cadastro, edição e exclusão conforme a propriedade. Não confiar no tutorId enviado pelo cliente. O backend não foi alterado nesta etapa.

## Compatibilidade e verificação

Sessão, Bearer Token e React Navigation foram preservados. Pets não usam mais o estado local ou fallback mock. Os registros antigos de pets no AsyncStorage não foram apagados; deixaram de ser lidos/escritos. Lembretes, histórico e demais funcionalidades locais permanecem; o seletor de pets dos lembretes usa a lista real.

Verificações sem rede: sintaxe Babel e imports locais, TypeScript dos módulos novos, contratos HTTP com adaptador simulado, filtro/propriedade, mutations e cache, validação e conversão de datas. A checagem dos hooks usa noImplicitAny=false por ausência preexistente de declarações React; não equivale a tipagem estrita de toda a aplicação.

Validação manual ponta a ponta permanece pendente: listar, cadastrar, detalhar, editar, excluir, lista vazia, erros e troca de sessão. O último teste informado no navegador estava bloqueado por CORS. Nenhuma validação real de CRUD contra a API é reivindicada nesta etapa.
