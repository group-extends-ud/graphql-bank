//Construccion de tablas a base de datos en caso de que no existan en el servidor
import { exec } from 'child_process';

import { query } from './databaseController';
import { key as DB } from '../../private/connection';

export async function build(): Promise<void> {
    if(!(await verifyTables())) {
        exec("cat src/docs/Database.sql", async (error, stdout) => {
            if(!error) {
                await query(stdout, []);
            }
        });
    }
}

async function verifyTables(): Promise<boolean> {
    let response: { [x: string]: any; }[] = [];
    try {
        response = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = $1", [ 'public' ]);
    } catch( _ ) {
        exec(`createdb -h ${DB.host} -p ${DB.port} -U ${DB.user} ${DB.database}`);
    }
    return (response.length)? true : false;
}