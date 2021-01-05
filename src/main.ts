//Dependencias necesarias

import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { Schema } from './graphQL/schema'
import morgan from 'morgan';

const app: Express = express();

app.use(morgan('dev'));

//Implementacion de graphql para la API
app.use('/', graphqlHTTP({
    graphiql: true,
    schema: Schema
}));

app.listen(3000);