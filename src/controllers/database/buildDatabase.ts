//Construccion de tablas a base de datos en caso de que no existan en el servidor
import { exec } from 'child_process';

import { query } from './databaseController';
import { key as DB } from '../../private/connection';
import { exit } from 'process';

export async function build(): Promise<void> {
    if(!(await verifyTables())) {
        console.log("Construyendo tablas");
        exec("cat src/docs/Database.sql", async (error, stdout) => {
            if(!error) {
                await query(stdout, []);
            }
        });
    }
}

async function verifyTables(): Promise<boolean> {
    let response: number;
    try {
        response = (await query("SELECT count(table_name) FROM information_schema.tables WHERE table_schema = $1", [ 'public' ]))[0].count;
    } catch( _ ) {
        console.log("No se puede crear la base de datos externamente");
        console.log(`Ejecuta: createdb -h ${process.env.POSTGRES_HOST} -p ${DB.port} -U ${DB.user} ${DB.database}`);
        exit();
    }
    return response == 6;
}