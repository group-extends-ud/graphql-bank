import { config } from 'dotenv';

//Configuracion del proyecto para la utilizacion de variables de entorno
config();

export const key = {
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'user',
    database: process.env.POSTGRES_DATABASE || 'database',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    connectionLimit: 10
};