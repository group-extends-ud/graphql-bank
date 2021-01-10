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
    console.log(query);
    return (await pool.query(query, object.getArray())).rows[0];
};

export async function deleteReg(table: string, id: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `DELETE FROM ${table} WHERE ${getIdDB(table)} = $1 RETURNING *;`;
    return (await pool.query(query, [ id ])).rows[0];
};

export async function updateReg(table: string, object: General, id: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `UPDATE ${table} SET ${getUpdateText(table, object)} RETURNING *;`;
    return (await pool.query(query, object.getArray())).rows[0];
};

export async function createRelation(table: string, idKey: number | string, idForeign: number | string): Promise<{ [x: string]: any; }> {
    const query: string = `INSERT INTO ${table}(${getIdDB(table)}, K_ID) VALUES($1, $2) RETURNING *;`;
    return (await pool.query(query, [ idKey, idForeign ])).rows[0];
}

export async function query(query: string, array: any[]): Promise<{ [x: string]: any; }[]> {
    return (array.length > 0)? (await pool.query(query, array)).rows : (await pool.query(query)).rows;
}