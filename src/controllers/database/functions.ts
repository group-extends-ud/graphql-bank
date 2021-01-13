//Metodos para determinar valores de consultas a la base de datos

import { General } from "../clases";

export function getIdDB(table: string): string {
    switch (table) {
        case 'Cliente':
            return 'K_ID';

        case 'Transaccion':
            return 'K_IDTX';

        case 'Cuenta_Aliada':
            return 'K_IDCUENTAALIADA';
        default:
            return 'K_IDCUENTA';
    }
};

export function getValueText(object: General): string {
    let query: string = '(';
    for(let key in object.getObject()) {
        query += `${key}, `;
    }
    query = query.substring(0, query.length - 2) + ') VALUES(';
    let array: any[] = object.getArray();
    for(let i: number = 1; i <= array.length; i++) {
        query += `$${i}, `;
    }
    query = query.substring(0, query.length - 2) + ')';
    return query;
};

export function getUpdateText(table: string, object: General): string {
    let query: string = '';
    let i: number = 1;
    for(let key in object.getObject()) {
        if(key != getIdDB(table)) {
            query += `${key} = $${i}, `;
        }
        i++;
    }
    query = query.substring(0, query.length - 2);
    query += ` WHERE ${getIdDB(table)} = $1`;
    return query;
};