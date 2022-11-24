
## Description

rest api web whatsapp para gestionar mensajes, contactos, por medio de un bot

## Installation

1. Clonar el proyecto

2. Ejecutar el comando `yarn install`

3. Clonar el archivo `.env.template` y renombrarlo por `.env`

4. Cambiar las variables de entorno

5. Levantar la base de datos

```
docker-compose up
```

6. Levantar modo desarollo:

```
yarn start:dev
```

<!-- 7. Ejecutar SEED -->

http://localhost:3000/api/seed


## Deploy app

### Heroku

1. login

```
heroku login
```

2. Add to remote heroku if not exist. If exist go to 4.

```
heroku git:remote -a wwmessagesmanager
```

3. Deploy your application

```
git push heroku <branch>
```

4. For existing repositories, simply add the heroku remote

```
heroku git:remote -a wwmessagesmanager
```

## Utils

```
heroku logs --tail
```
<!-- ## Running the app

```bash
# development
$ yarn start:dev

``` -->

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->
