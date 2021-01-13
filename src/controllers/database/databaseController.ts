import { pool } from './database';
import { getIdDB, getUpdateText, getValueText } from './functions';
import { General } from '../clases';

//Funciones internas de base de datos con las operaciones basicas a realizar
export async function getAll(table: string): Promise<{ [x: string]: any; }[]> {
    const query: string = `SELECT * FROM ${table};`;
    return (await pool.query(query)).rows;
};

export async function getById(table: string, id: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `SELECT * FROM ${table} WHERE ${getIdDB(table)} = $1;`;
    return (await pool.query(query, [ id ])).rows[0];
};

export async function createReg(table: string, object: General): Promise<{ [x: string]: any; }> {
    const query: string = `INSERT INTO ${table}${getValueText(object)} RETURNING *;`;
    return (await pool.query(query, object.getArray())).rows[0];
};

export async function deleteReg(table: string, id: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `DELETE FROM ${table} WHERE ${getIdDB(table)} = $1 RETURNING *;`;
    return (await pool.query(query, [ id ])).rows[0];
};

export async function updateReg(table: string, object: General): Promise<{ [x: string]: any; }> {
    const query: string = `UPDATE ${table} SET ${getUpdateText(table, object)} RETURNING *;`;
    return (await pool.query(query, object.getArray())).rows[0];
};

export async function createRelation(tableRelation: string, table: string, idKey: number | string, idRelation: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `INSERT INTO ${tableRelation}(${getIdDB(table)}, ${getIdDB(tableRelation)}) VALUES($1, $2) RETURNING *;`;
    return (await pool.query(query, [ idKey, idRelation ])).rows[0];
};

export async function getRelation(tableRelation: string, table: string, idKey: number | string): Promise<{ [x: string]: any; }[]> {
    let query: string = `SELECT * FROM ${table} INNER JOIN ${tableRelation} ON `;

    switch (tableRelation) {
        case 'Cuenta':
            query += 'Transaccion.K_IDCUENTA = Cuenta.K_IDCUENTA WHERE Cuenta.K_IDCUENTA = $1 ORDER BY K_IDTX desc LIMIT 5;';
            break;

        case 'Cliente_Cuenta':
            query += 'Cuenta.K_IDCUENTA = Cliente_Cuenta.K_IDCUENTA WHERE Cliente_Cuenta.K_ID = $1;';
            break;
    
        default:
            query += 'Cuenta.K_IDCUENTA = Cuenta_Aliada.K_IDCUENTAALIADA WHERE Cuenta_Aliada.K_IDCUENTA = $1;';
            break;
    }

    return (await pool.query(query, [ idKey ])).rows;
};

export async function query(query: string, array: any[] = []): Promise<{ [x: string]: any; }[]> {
    return (array.length > 0)? (await pool.query(query, array)).rows : (await pool.query(query)).rows;
};