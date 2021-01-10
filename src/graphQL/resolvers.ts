import { Cliente, Cuenta, Fecha, Transaccion } from '../controllers/clases';
import { getAll, createReg, deleteReg, getById, updateReg, createRelation, query } from '../controllers/database/databaseController';

/*
Funciones a ejecutar dependiendo de tipo y llamado definido en schema.ts

Query define las funciones que unicamente tienen como proposito retornar datos

Mutation modificaran los datos en base de datos ya sea creando, borrando o editando registros

Cada propiedad individual de resolvers retornará un dato o un valor booleando indicando que el proceso se pudo realizar sin problemas
*/

export const resolvers: { [x: string]: any; } = {
    Query: {
        Cliente: async (_: any, { id }: { [id: string]: number | string; }): Promise<Cliente | null> => {
            const response = await getById("Cliente", id);
            return (response)? new Cliente(
                response.k_id,
                response.n_nombre,
                response.n_apellido,
                response.q_edad
            ) : null;
        },
        Clientes: async (): Promise<Cliente[] | null> => {
            let clientes: Cliente[] = [];
            const response = await getAll("Cliente");

            if(!(response.length)) return null;

            response.forEach((element: { [x: string]: any; }) => {
                clientes.push(new Cliente(
                    element.k_id,
                    element.n_nombre,
                    element.n_apellido,
                    element.q_edad
                ));
            });

            return clientes;
        },

        Cuenta: async (_: any, { id }: { [id: string]: number | string; }): Promise<Cuenta | null> => {
            const response = await getById("Cuenta", id);
            return (response)? new Cuenta(
                response.k_idcuenta,
                response.q_contrasenna,
                response.q_saldo,
                response.n_tipo
            ) :  null;
        },
        Cuentas: async (): Promise<Cuenta[] | null> => {
            let cuentas: Cuenta[] = [];
            const response = await getAll("Cuenta");

            if(!(response.length)) return null;

            response.forEach((element: { [x: string]: any; }) => {
                cuentas.push(new Cuenta(
                    element.k_idcuenta,
                    element.q_contrasenna,
                    element.q_saldo,
                    element.n_tipo
                ));
            });
            
            return cuentas;
        },

        Transaccion: async (_: any, { id }: { [id: string]: number | string; }): Promise<Transaccion | null> => {
            const response = await getById("Transaccion", id);
            return (response)? new Transaccion(
                response.k_idtx,
                new Fecha(
                    response.f_dia,
                    response.f_mes,
                    response.f_anno
                ),
                response.o_descripcion,
                response.o_tipo,
                response.k_idcuenta
            ) : null;
        },
        Transacciones: async (): Promise<Transaccion[] | null> => {
            let transacciones: Transaccion[] = [];
            const response = await getAll("Transaccion");

            if(!(response.length)) return null;

            response.forEach((element: { [x: string]: any; }) => {
                transacciones.push(new Transaccion(
                    element.k_idtx,
                    new Fecha(
                        element.f_dia,
                        element.f_mes,
                        element.f_anno
                    ),
                    element.o_descripcion,
                    element.o_tipo,
                    element.k_idcuenta
                ));
            });

            return transacciones;
        },

        TransaccionesPorCuenta: async (_: any, { idCuenta }: { [id: string]: number | string; }): Promise<Transaccion[] | null> => {
            let transacciones: Transaccion[] = [];
            const response = await query('SELECT * FROM Transaccion WHERE K_IDCUENTA = $1 ORDER BY K_IDTX asc LIMIT 5;', [ idCuenta ]);

            if(!(response.length)) return null;

            response.forEach((element: { [x: string]: any; }) => {
                transacciones.push(new Transaccion(
                    element.k_idtx,
                    new Fecha(
                        element.f_dia,
                        element.f_mes,
                        element.f_anno
                    ),
                    element.o_descripcion,
                    element.o_tipo,
                    element.k_idcuenta
                ));
            });

            return transacciones;

        },
        CuentasPorCliente: async (_: any, { idCliente }: { [id: string]: number | string; }): Promise<Cuenta[] | null> => {
            let cuentas: Cuenta[] = [];
            const response = await query('SELECT * FROM Cuenta INNER JOIN Cliente_Cuenta ON Cuenta.K_IDCUENTA = Cliente_Cuenta.K_IDCUENTA WHERE Cliente_Cuenta.K_ID = $1', [ idCliente ]);
            
            if(!(response.length)) return null;

            response.forEach((element: { [x: string]: any; }) => {
                cuentas.push(new Cuenta(
                    element.k_idcuenta,
                    element.q_contrasenna,
                    element.q_saldo,
                    element.n_tipo
                ));
            });
            
            return cuentas;
        }
    },

    Mutation: {
        CrearCliente: async (_: any, { input }: { [x: string]: any; }): Promise<Cliente | null> => {
            const cliente: Cliente = new Cliente(
                input.id,
                input.nombre,
                input.apellido,
                input.edad
            );
            const response = await createReg("Cliente", cliente);
            return (response)? new Cliente(
                response.k_id,
                response.n_nombre,
                response.n_apellido,
                response.q_edad
            ) : null;
        },
        ActualizarCliente: async (_: any, { input }: { [id: string]: any; }): Promise<Cliente | null> => {
            let cliente: Cliente = new Cliente(
                input.id,
                input.nombre,
                input.apellido,
                input.edad
            );
            const response = await updateReg("Cliente", cliente, input.id);
            return (response)? new Cliente(
                response.k_id,
                response.n_nombre,
                response.n_apellido,
                response.q_edad
            ) : null;
        },
        BorrarCliente: async (_: any, { id }: { [id: string]: string | number; }): Promise<Cliente | null> => {
            const response = await deleteReg("Cliente", id);
            return (response)? new Cliente(
                response.k_id,
                response.n_nombre,
                response.n_apellido,
                response.q_edad
            ) : null;
        },

        CrearCuenta: async (_: any, { input }: { [id: string]: any; }): Promise<Cuenta | null> => {
            let cuenta: Cuenta = new Cuenta(
                input.id,
                input.contrasenna,
                input.saldo,
                input.tipo
            );
            const response = await createReg("Cuenta", cuenta);
            return (response)? new Cuenta(
                response.k_idcuenta,
                response.q_contrasenna,
                response.q_saldo,
                response.n_tipo
            ) : null;
        },
        ActualizarCuenta: async (_: any, { input }: { [id: string]: any; }): Promise<Cuenta | null> => {
            let cuenta: Cuenta = new Cuenta(
                input.id,
                input.contrasenna,
                input.saldo,
                input.tipo
            );
            const response = await updateReg("Cuenta", cuenta, input.id);
            return (response)? new Cuenta(
                response.k_idcuenta,
                response.q_contrasenna,
                response.q_saldo,
                response.n_tipo
            ) : null;
        },
        BorrarCuenta: async (_: any, { id }: { [id: string]: string | number; }): Promise<Cuenta | null> => {
            const response = await deleteReg("Cuenta", id);
            return (response)? new Cuenta(
                response.k_idcuenta,
                response.q_contrasenna,
                response.q_saldo,
                response.n_tipo
            ) : null;
        },

        CrearTransaccion: async (_: any, { input }: { [id: string]: any; }): Promise<Transaccion | null> => {
            const date: Date = new Date();
            let transaccion: Transaccion = new Transaccion(
                input.id,
                new Fecha(
                    date.getUTCDate(),
                    date.getUTCMonth() + 1,
                    date.getUTCFullYear()
                ),
                input.operacionDescripcion,
                input.operacionTipo,
                input.idCuenta
            );
            const response = await createReg("Transaccion", transaccion);
            return (response)? new Transaccion(
                response.k_idtx,
                new Fecha(
                    response.f_dia,
                    response.f_mes,
                    response.f_anno
                ),
                response.o_descripcion,
                response.o_tipo,
                response.k_idcuenta
            ) : null;
        },
        ActualizarTransaccion: async (_: any, { input }: { [id: string]: any; }): Promise<Transaccion | null> => {
            const date: Date = new Date();
            let transaccion: Transaccion = new Transaccion(
                input.id,
                new Fecha(
                    date.getUTCDate(),
                    date.getUTCMonth() + 1,
                    date.getUTCFullYear()
                ),
                input.operacionDescripcion,
                input.operacionTipo,
                input.idCuenta
            );
            const response = await updateReg("Transaccion", transaccion, input.id);
            return (response)? new Transaccion(
                response.k_idtx,
                new Fecha(
                    response.f_dia,
                    response.f_mes,
                    response.f_anno
                ),
                response.o_descripcion,
                response.o_tipo,
                response.k_idcuenta
            ) : null;
        },
        BorrarTransaccion: async (_: any, { id }: { [id: string]: string | number; }): Promise<Transaccion | null> => {
            const response = await deleteReg("Transaccion", id);
            return (response)? new Transaccion(
                response.k_idtx,
                new Fecha(
                    response.f_dia,
                    response.f_mes,
                    response.f_anno
                ),
                response.o_descripcion,
                response.o_tipo,
                response.k_idcuenta
            ) : null;
        },

        VincularClienteCuenta: async (_: any, { idCliente, idCuenta }: { [x: string]: number | string; }): Promise<boolean> => {
            const response = await createRelation("Cliente_Cuenta", idCuenta, idCliente);
            return (response)? true : false;
        },
        DesvincularClienteCuenta: async (_: any, { idCuenta }: { [id: string]: number | string; }): Promise<boolean> => {
            const response = await deleteReg("Cliente_Cuenta", idCuenta);
            return (response)? true : false;
        }
    }
};