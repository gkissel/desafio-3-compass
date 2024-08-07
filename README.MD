Descrição do desafio
# Desafio 3 - Compass

O desafio consiste em desenvolver uma aplicação web que permita a criação e autenticação de usuários, além da criação de eventos associados a esses usuários. A aplicação deve seguir as melhores práticas de desenvolvimento, utilizando uma arquitetura bem definida e tecnologias modernas.

## Funcionalidades

- Cadastro de Usuário: Permite que novos usuários se cadastrem na aplicação.
- Autenticação de Usuário: Permite que usuários existentes façam login.
- Criação de Eventos: Permite que usuários autenticados criem eventos associados a eles.
- Adição de Perfil de Usuário: Permite que usuários adicionem foto de perfil.

## Regras de negócio

- Validação de Dados: Todos os dados de entrada devem ser validados antes de serem processados.
- Senhas: As senhas dos usuários devem ser criptografadas antes de serem armazenadas.
- Eventos: Apenas usuários autenticados podem criar eventos.
- Erros: Erros devem ser tratados e mensagens de erro apropriadas devem ser retornadas ao cliente.

## O projeto

O projeto é uma aplicação web construída utilizando Node.js e Express, com um banco de dados gerenciado pelo Prisma ORM. A aplicação segue uma arquitetura modular, com controladores separados para diferentes funcionalidades.

## Stack de desenvolvimento utilizada

- Node.js: Ambiente de execução JavaScript.
- Express: Framework web para Node.js.
- Prisma: ORM para gerenciamento do banco de dados.
- Joi: Biblioteca para validação de dados.
- Jest: Biblioteca para testes.
- Bcrypt: Biblioteca para criptografia de senhas.
- Swagger: Ferramenta para documentação de APIs.

## Rotas

### Usuário

- POST /api/v1/user/sign-up: Cadastro de novo usuário.
- POST /api/v1/user/sign-in: Autenticação de usuário.
- POST /api/v1/user/add-profile: Adição de perfil de usuário.

### Eventos

- POST /api/v1/events: Criação de novo evento.

## Payloads

### Cadastro de Usuário

Endpoint: /api/v1/user/sign-up

Método: POST

Payload:

```json
{
    "firstName": "string",
    "lastName": "string",
    "birthDate": "string",
    "city": "string",
    "country": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
}
```

### Autenticação de Usuário

Endpoint: /api/v1/user/sign-in

Método: POST

Payload:

```json
{
    "email": "string",
    "password": "string"
}
```

### Adição de Perfil de Usuário

Endpoint: /api/v1/user/add-profile

Método: POST

Payload:

```json
{
    "profileData": "object"
}
```

### Criação de Evento

Endpoint: /api/v1/events

Método: POST

Payload:

```json
{
    "description": "string",
    "dayOfWeek": "string",
    "userId": "string"
}
```

## Como executar o projeto

1. Clone o repositório:
     ```
     git clone <URL_DO_REPOSITORIO>
     cd <NOME_DO_REPOSITORIO>
     ```

2. Instale as dependências:
     ```
     npm install
     ```

3. Configure as variáveis de ambiente: Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:
     ```
     PORT=3333
     JWT_SECRET=<sua_chave_secreta para jwt>
     DATABASE_URL="mongodb://root:prisma@localhost:27017/prisma-mongo?authSource=admin&retryWrites=true&w=majority"
     AWS_BUCKET_NAME=<nome_do_bucket_aws>
     ```
4. Inicie o banco de dados:
     ```
     docker compose up -d
     ```
     
5. Execute as migrações do banco de dados:
     ```
     npx prisma db push
     ```

6. Faça o build do servidor:
     ```
     npm run build
     ```

7. Inicie o servidor:
     ```
     npm start
     ```

8. Acesse a documentação da API: Abra o navegador e acesse http://localhost:<PORTA>/api/v1/docs para visualizar a documentação gerada pelo Swagger.


9. Voce pode fazer testes unitários rodando:
     ```
     npm test
     ```
10. Voce pode fazer testes E2E rodando:
     ```
     npm test:e2e
     ```

## Membros da equipe

- Gustavo Kissel: Desenvolvedor