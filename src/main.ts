//Dependencias necesarias
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import morgan from 'morgan';

import { Schema } from './graphQL/schema'
import { build } from './controllers/database/buildDatabase';

const app: Express = express();

app.use(morgan('dev'));

//Implementacion de graphql para la API
app.use('/', graphqlHTTP({
    graphiql: true,
    schema: Schema
}));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), async () => {
    await build();
    console.log(`Ejecutando GraphQL en ${process.env.HOST}:${app.get('port')}`);
    console.log(`Ejecutando PostgreSQL en ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`);
});