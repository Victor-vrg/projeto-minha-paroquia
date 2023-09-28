# Esquema do Banco de Dados

## Tabela: Paroquias
- **ID**: Um identificador único para cada paróquia.
- **NomeParoquia**: O nome da paróquia, não pode ser nulo.
- **Padres**: O nome dos padres da paróquia.
- **CEP**: O Código de Endereçamento Postal (CEP) da paróquia, não pode ser nulo.
- **LocalizacaoParoquia**: A localização física da paróquia.
- **Bairro**: O bairro onde a paróquia está localizada.
- **InformacoesAdicionais**: Informações adicionais sobre a paróquia.
- **EmailResponsavel**: O endereço de e-mail do responsável pela paróquia, não pode ser nulo.

## Tabela: ServicosComunitarios
- **ID**: Um identificador único para cada serviço comunitário.
- **ServicoComunitario**: O nome do serviço comunitário.
- **DescricaoServico**: A descrição do serviço comunitário.
- **ObjetivosServico**: Os objetivos do serviço comunitário.
- **PublicoAlvoServico**: O público-alvo do serviço comunitário.
- **TipoServicoComunitario**: O tipo de serviço comunitário (pastoral, grupo, voluntariado, etc.).
- **ParoquiaID**: O ID da paróquia associada ao serviço comunitário.
- **Ativo**: Um campo booleano que indica se o serviço comunitário está ativo.

## Tabela: Usuarios
- **ID**: Um identificador único para cada usuário.
- **NomeCompleto**: O nome completo do usuário, não pode ser nulo.
- **Email**: O endereço de e-mail do usuário, não pode ser nulo.
- **Telefone**: O número de telefone do usuário.
- **Bairro**: O bairro onde o usuário reside.
- **DataNascimento**: A data de nascimento do usuário.
- **ParoquiaMaisFrequentada**: A paróquia mais frequentada pelo usuário, com uma chave estrangeira que faz referência à tabela `Paroquias`.
- **NivelAcesso**: O nível de acesso do usuário.
- **IDServicoComunitario**: O ID do serviço comunitário associado ao usuário, com uma chave estrangeira que faz referência à tabela `ServicosComunitarios`.
- **SenhaHash**: A senha criptografada do usuário, não pode ser nulo.
- **Cargo**: O cargo do usuário em um serviço comunitário específico.

## Tabela: Eventos
- **ID**: Um identificador único para cada evento.
- **NomeEvento**: O nome do evento, não pode ser nulo.
- **DataInicio**: A data de início do evento.
- **DataFim**: A data de término do evento.
- **HoraInicio**: A hora de início do evento.
- **HoraFim**: A hora de término do evento.
- **LocalizacaoEvento**: A localização física do evento.
- **DescricaoEvento**: A descrição do evento.
- **CaminhoImagem**: O caminho para a imagem relacionada ao evento.
- **TipoEvento**: O tipo de evento.
- **Participacao**: A participação no evento (Sim, Talvez, Não).

## Tabela: Eventos_ServicosComunitarios
- **EventoID**: Um ID de evento associado a um serviço comunitário, com uma chave primária composta juntamente com `ServicoComunitarioID`.
- **ServicoComunitarioID**: Um ID de serviço comunitário associado a um evento.

## Tabela: Excursoes
- **ID**: Um identificador único para cada excursão.
- **NomeExcursao**: O nome da excursão.
- **DescricaoExcursao**: A descrição da excursão.
- **DataInicioExcursao**: A data de início da excursão.
- **DataFimExcursao**: A data de término da excursão.
- **HoraInicioExcursao**: A hora de início da excursão.
- **HoraFimExcursao**: A hora de término da excursão.
- **LocalizacaoExcursao**: A localização física da excursão.
- **PrecoExcursao**: O preço da excursão.
- **VagasExcursao**: O número de vagas disponíveis na excursão.
- **ParoquiaID**: O ID da paróquia associada à excursão.

## Tabela: Inscricoes
- **ID**: Um identificador único para cada inscrição.
- **UsuarioID**: Um ID de usuário associado à inscrição.
- **ServicoComunitarioID**: Um ID de serviço comunitário associado à inscrição.
- **DataInscricao**: A data de inscrição.

## Tabela: Tokens
- **ID**: Um identificador único para cada token.
- **UserID**: Um ID de usuário associado ao token, com uma chave estrangeira que faz referência à tabela `Usuarios`.
- **Token**: O valor do token.
- **Expiracao**: O timestamp de expiração do token.

Este esquema de banco de dados inclui as atualizações nas tabelas e suas respectivas descrições. 
