# elabs-backend-nestjs
elabs-backend-nestjs

## NestJS basic concepts

- Module is the biggest component. App has to have at least one module which is called app module. The app module has many children modules.

- Module may have: controller, service and other components (guard, middleware, ...).

- Be careful when including other modules to avoid circular dependencies.

## Authentication

- Use JWT token.

- User login and get token, this token will be expired in 10 minutes.
 
## Installation

```bash
cd elabs-backend-nestjs/
yarn install
```

## Environment variables

This app uses postgresql, so please install postgresql from your end and set variables for .env file as below, for example:

```
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=elabs
DATABASE_SYNC=1

BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
BLOCKFROST_KEY=preprodH3StnjW9yKKHB5UaDSTecHvJxyuJJFRV
CARDANO_ENV=Preprod

JWT_SECRET=Abc123@@

ENCRYPT_KEY=Abc123@@
```

## Secure keys
- Please secure the JWT_SECRET and ENCRYPT_KEY in env variables.
    + JWT_SECRET: it is used for authorization.
    + ENCRYPT_KEY: it is used to encrypt user's password and then save encrypted password in DB.

## Seeding users
We can init database by using seeder
- DATABASE_SYNC = 1 -> data in table is cleaned every time when start app
- DATABASE_SYNC = 0 -> only sync with current DB

At the first time, we must set DATABASE_SYNC = 1

Set admin password by this command

```bash
export ADMIN_PASS=
```

For example:

```bash
export ADMIN_PASS=123456
```

Run to init database

```bash
npm run seed
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Swagger UI

Open your browser and visit this url to open the swagger UI:

```
http://localhost:3000/api
```

1. Execute /auth/login to get the Bearer token

The request body is as below, for example:

```
{
  "user_name": "admin",
  "password": "123456"  // your password from previous step 
}
```

Result, for example:

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZTE0ZGMyZS0xYjE1LTRkOWUtOGI0OC02ZTNhZjY5MjA1ZTYiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzEzNzYxNDUzLCJleHAiOjE3MTM3NjIwNTN9.2eqCbzfKCV6Ucq7BuqtdcunUgogIz5ATjSUqYBuIg4U"
}
```

Click `Authorize` on the top right corner and set for the token.

2. Execute /auth/profile to get the current profile

Result, for example:

```
{
  "sub": "ae14dc2e-1b15-4d9e-8b48-6e3af69205e6",
  "username": "admin",
  "roles": [
    "admin"
  ],
  "iat": 1713761453,
  "exp": 1713762053
}
```

3. Execute /users (POST) to create a new user

The request body is as below, for example:

```
{
  "user_name": "congle",
  "password": "Abc123@@",
  "first_name": "Cong",
  "last_name": "Le"
}
```

Result, for example:

```
{
  "id": "697dc60b-d769-4266-bb75-34eaff160d00",
  "username": "congle",
  "first_name": "Cong",
  "last_name": "Le",
  "address": "addr_test1vpu2e0yz2nfygmnd0vw3dx5lhj369q9vmavtj49erq9ju8c26ygd2"
}
```

4. Execute /users (GET) to get all users

## Create a new API

At first, you need to have basic knowledge about nestjs by going through this doc: https://docs.nestjs.com/ (at least, please going through OVERVIEW section).

Then, to create a new API, we could use the nest-cli.

```bash
nest g resource <your_module>
```

For example:

```bash
nest g resource users
```

Choose `REST API` and enter, then choose `y`

It will generate a skeleton with module, controller, service, dto, entities. Then, please update all of them to meet your requirements.

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## DB migration cli

```
npm run migration:create -- <path_name>
npm run migration:create -- ./src/db/migrations/wallet

npm run migrate
npm run migration:down
```

When you want to revert multi files (multi version), run `npm run migration:down` multi times.
