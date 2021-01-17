import { Cliente, Cuenta, General, Transaccion } from '../controllers/clases';
import { getAll, createReg, deleteReg, getById, updateReg, createRelation, query, getRelation } from '../controllers/database/databaseController';

//Funcion para instanciar un objeto de alguna de las clases hijas de General
function instance(table: string, object: { [x: string]: any; }): any {

    let general: General = new General();

    if(!object) return null;

    switch (table) {
        case "Cliente":
            general = new Cliente(object);
            break;
        
        case "Cuenta":
            general = new Cuenta(object);
            break;
        
        case "Transaccion":
            general = new Transaccion(object);
            break;
        
        default:
            return true;
    };

    return general;

};

//Funcion para instanciar un arreglo de objetos de alguna de las clases hijas de General
function instanceMultiple(table: string, object: { [x: string]: any }[]): any[] | null {

    let generales: General[] = [];

    if(!(object.length)) return null;

    object.forEach((element: { [x: string]: any; }) => {
        switch (table) {
            case "Cliente":
                generales.push(new Cliente(element));
                break;
            
            case "Cuenta":
                generales.push(new Cuenta(element));
                break;
            
            case "Transaccion":
                generales.push(new Transaccion(element));
        };
    });

    return generales;

};

//Funcion para obtener un arreglo de objetos dependiendo de la tabla en base de datos que se busque
async function getMultiple(table: string): Promise<any[] | null> {

    const response: { [x: string]: any; }[] = await getAll(table);

    return instanceMultiple(table, response);

};

//Funcion para obtener un unico objeto dependiendo de tabla e id
async function getUnique(table: string, id: number | string): Promise<any | null> {

    const response: { [x: string]: any; } = await getById(table, id);

    return instance(table, response);

};

//Funcion para obtener un arreglo de objetos con base a una relacion de interseccion entre tablas, y filtrado por un parametro especifico (opcional)
async function getByRelation(table: string, tableForeign: string, idKey: number | string): Promise<any[] | null> {

    const response: { [x: string]: any; }[] = await getRelation(tableForeign, table, idKey);

    return instanceMultiple(table, response);

};

//Metodo de creacion para la insercion de datos en base de datos
async function createGeneral(table: string, input: { [x: string]: any; }): Promise<any | null> {

    const general: General = instance(table, input);

    const response: { [x: string]: any; } = await createReg(table, general);

    return instance(table, response);
};

//Metodo de edicion para la actualizacion de datos en base de datos
async function updateGeneral(table: string, input: { [x: string]: any; }): Promise<any | null> {
    let general: General = instance(table, input);

    const response: { [x: string]: any; } = await updateReg(table, general);

    return instance(table, response);
};

//Metodo de borrado para la eliminacion de datos en base de datos
async function deleteGeneral(table: string, id: number | string): Promise<any | null> {

    const response: { [x: string]: any; } = await deleteReg(table, id);

    return instance(table, response);
    
};

async function transaccionesPorCuenta(idCuenta: number | string): Promise<Transaccion[] | null> {

    return await getByRelation("Transaccion", "Cuenta", idCuenta);

};

async function cuentasPorCliente(idCliente: number | string): Promise<Cuenta[] | null> {

    return await getByRelation("Cuenta", "Cliente_Cuenta", idCliente);

};

/*
Funciones a ejecutar dependiendo de tipo y llamado definido en schema.ts

Query define las funciones que unicamente tienen como proposito retornar datos

Mutation modificaran los datos en base de datos ya sea creando, borrando o editando registros

Cada propiedad individual de resolvers retornará un dato o un valor booleando indicando que el proceso se pudo realizar sin problemas
*/

export const resolvers: { [x: string]: any; } = {
    Query: {
        Cliente: async (_: any, { id }: { [id: string]: number | string; }): Promise<Cliente | null> => {

            return await getUnique("Cliente", id);

        },
        Clientes: async (): Promise<Cliente[] | null> => {

            return await getMultiple("Cliente");

        },

        Cuenta: async (_: any, { id }: { [id: string]: number | string; }): Promise<Cuenta | null> => {

            return await getUnique("Cuenta", id);

        },
        Cuentas: async (): Promise<Cuenta[] | null> => {

            return await getMultiple("Cuenta");

        },

        Transaccion: async (_: any, { id }: { [id: string]: number | string; }): Promise<Transaccion | null> => {

            return await getUnique("Transaccion", id);

        },
        Transacciones: async (): Promise<Transaccion[] | null> => {

            return await getMultiple("Transaccion");

        },

        TransaccionesPorCuenta: async (_: any, { idCuenta }: { [id: string]: number | string; }): Promise<Transaccion[] | null> => {

            return await getByRelation("Transaccion", "Cuenta", idCuenta);
        
        },
        UltimaTransaccion: async(_: any, { idCuenta }: { [id: string]: number | string; }): Promise<Transaccion | null> => {
            let response: Transaccion[] | null = await getByRelation("Transaccion", "Cuenta", idCuenta)
            let id: number = 1;
            response?.forEach(element => {
                id = (element.getObject().K_IDTX > id)? element.getObject().K_IDTX : id;
            });
            let transaccion: Transaccion | undefined = (response?.find(element => element.getObject().K_IDTX == id));
            return (transaccion)? transaccion : null;
        },

        CuentasPorCliente: async (_: any, { idCliente }: { [id: string]: number | string; }): Promise<Cuenta[] | null> => {
        
            return await getByRelation("Cuenta", "Cliente_Cuenta", idCliente);
        
        },
        CuentasAliadas: async (_: any, { idCuenta }: { [id: string]: number | string; }): Promise<Cuenta[] | null> => {

            return await getByRelation("Cuenta", "Cuenta_Aliada", idCuenta);

        },

        Login: async (_: any, { idCuenta, contrasenna }: { [x: string]: number | string; }): Promise<boolean> => {
            let response: Cuenta = await getUnique("Cuenta", idCuenta);
            return response.getObject().Q_CONTRASENNA == contrasenna;
        }
    },

    Mutation: {
        CrearCliente: async (_: any, { input }: { [x: string]: any; }): Promise<Cliente | null> => {

            return await createGeneral("Cliente", input);

        },
        ActualizarCliente: async (_: any, { input }: { [id: string]: any; }): Promise<Cliente | null> => {

            return await updateGeneral("Cliente", input);

        },
        BorrarCliente: async (_: any, { id }: { [id: string]: string | number; }): Promise<Cliente | null> => {

            return await deleteGeneral("Cliente", id);

        },

        CrearCuenta: async (_: any, { input }: { [id: string]: any; }): Promise<Cuenta | null> => {

            return await createGeneral("Cuenta", input);

        },
        ActualizarCuenta: async (_: any, { input }: { [id: string]: any; }): Promise<Cuenta | null> => {

            return await updateGeneral("Cuenta", input);

        },
        BorrarCuenta: async (_: any, { id }: { [id: string]: string | number; }): Promise<Cuenta | null> => {

            return await deleteGeneral("Cuenta", id);

        },

        CrearTransaccion: async (_: any, { input }: { [x: string]: any; }): Promise<Transaccion | null> => {

            let realizaCambio: boolean = false;

            let response: any = null;

            const saldoCuenta: number = Number((await getUnique("Cuenta", input.idCuenta)).getObject().Q_SALDO);
            const description: string[] = input.operacionDescripcion.split(' ');
            const saldoTransaccion: number = Number((description.length > 1)? description[1] : description[0]);

            const validateMoney: boolean = (saldoTransaccion <= saldoCuenta)? true : false;

            switch (input.operacionTipo) {
                case 'Transferencia':
                    if(description.length !== 2) break;
                    if(description[0] == input.idCuenta) break;

                    if(validateMoney) {
                        const cuentaAliada: any = (await getUnique("Cuenta", description[0])).getObject();

                        await updateGeneral("Cuenta", {id: cuentaAliada.K_IDCUENTA, saldo: String(Number(cuentaAliada.Q_SALDO) + saldoTransaccion)});
                    } else {
                        break;
                    };
            
                case "Retiro":
                    if(validateMoney) {
                        await updateGeneral("Cuenta", {id: input.idCuenta, saldo: String(saldoCuenta - saldoTransaccion)});
                        response = await createGeneral("Transaccion", input);
                        realizaCambio = true;
                    }
            }

            if(realizaCambio && !(response)) {
                if(input.operacionTipo == 'Transferencia') {
                    const cuentaAliada = (await getUnique("Cuenta", description[0])).getObject();
                    await updateGeneral("Cuenta", {id: cuentaAliada.K_IDCUENTA, saldo: String(Number(cuentaAliada.Q_SALDO) - saldoTransaccion)});
                }
                await updateGeneral("Cuenta", {id: input.idCuenta, saldo: String(saldoCuenta + saldoTransaccion)});
                await deleteGeneral("Transaccion", response?.getObject().K_IDTX);
            }

            return response;

        },
        ActualizarTransaccion: async (_: any, { input }: { [id: string]: any; }): Promise<Transaccion | null> => {

            return await updateGeneral("Transaccion", input);

        },
        BorrarTransaccion: async (_: any, { id }: { [id: string]: string | number; }): Promise<Transaccion | null> => {

            return await deleteGeneral("Transaccion", id);
            
        },

        VincularClienteCuenta: async (_: any, { idCliente, idCuenta }: { [x: string]: number | string; }): Promise<boolean> => {
            const response = await createRelation("Cliente_Cuenta", "Cliente", idCuenta, idCliente);
            return (response)? true : false;
        },
        DesvincularClienteCuenta: async (_: any, { idCuenta }: { [id: string]: number | string; }): Promise<boolean> => {
            const response = await deleteGeneral("Cliente_Cuenta", idCuenta);
            return response;
        },

        VincularCuentaAliada: async (_: any, { idCuenta, idCuentaAliada }: { [x: string]: number | string; }): Promise<boolean> => {
            const response = await createRelation("Cuenta_Aliada", "Cuenta", idCuenta, idCuentaAliada);
            return (response)? true : false;
        },
        DesvincularCuentaAliada: async (_: any, { idCuenta, idCuentaAliada }: { [id: string]: number | string; }): Promise<boolean> => {
            const response = (await query("DELETE FROM Cuenta_Aliada WHERE K_IDCUENTA = $1 AND K_IDCUENTAALIADA = $2 RETURNING *;", [idCuenta, idCuentaAliada])).length;
            return (response)? true : false;
        }
    }
};