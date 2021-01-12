import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, ITypeDefinitions } from 'graphql-tools';
import { resolvers } from './resolvers';

/*
En typeDefs se definen los tipos de dato que manejará Graphql, entendiendo como tipo de dato un objeto clave-valor

Los type son los datos que puede entender y retornar esta api

Los input son objetos de mismas caracteristicas, pero que se utilizan para la entrada de datos en el query

Los Query y Mutation definen a las funciones que se pueden llamar desde el api y que retornaran
*/

const typeDefs: ITypeDefinitions = `

    type Fecha {
        dia: Int!
        mes: Int!
        anno: Int!
    }

    type Cliente {
        id: ID!
        nombre: String!
        apellido: String!
        edad: Int!
    }

    input ClienteInput {
        id: ID!
        nombre: String
        apellido: String
        edad: Int
    }

    input ClienteInputRequired {
        id: ID!
        nombre: String!
        apellido: String!
        edad: Int!
    }

    type Cuenta {
        id: ID!
        saldo: String!
        tipo: String!
        contrasenna: Int!
    }

    input CuentaInput {
        id: ID!
        saldo: String
        tipo: String
        contrasenna: Int
    }

    input CuentaInputRequired {
        saldo: String!
        tipo: String!
        contrasenna: Int!
    }

    type Transaccion {
        id: ID!
        fecha: Fecha!
        operacionDescripcion: String!
        operacionTipo: String!
        idCuenta: ID!
    }

    input TransaccionInputRequired {
        operacionDescripcion: String!
        operacionTipo: String!
        idCuenta: ID!
    }

    input TransaccionInput {
        id: ID!
        operacionDescripcion: String
        operacionTipo: String
        idCuenta: ID
    }

    type Query {
        Cliente(id: ID!): Cliente
        Clientes: [Cliente]

        Cuenta(id: ID!): Cuenta
        Cuentas: [Cuenta]

        Transaccion(id: ID!): Transaccion
        Transacciones: [Transaccion]

        TransaccionesPorCuenta(idCuenta: ID!): [Transaccion]
        CuentasPorCliente(idCliente: ID!): [Cuenta]
        CuentasAliadas(idCuenta: ID!): [Cuenta]
    }

    type Mutation {
        CrearCliente(input: ClienteInputRequired!): Cliente
        ActualizarCliente(input: ClienteInput!): Cliente
        BorrarCliente(id: ID!): Cliente

        CrearCuenta(input: CuentaInputRequired!): Cuenta
        ActualizarCuenta(input: CuentaInput!): Cuenta
        BorrarCuenta(id: ID!): Cuenta

        CrearTransaccion(input: TransaccionInputRequired!): Transaccion
        ActualizarTransaccion(input: TransaccionInput!): Transaccion
        BorrarTransaccion(id: ID!): Transaccion

        VincularClienteCuenta(idCliente: ID!, idCuenta: ID!): Boolean
        DesvincularClienteCuenta(idCuenta: ID!): Boolean

        VincularCuentaAliada(idCuenta: ID!, idCuentaAliada: ID!): Boolean
        DesvincularCuentaAliada(idCuenta: ID!, idCuentaAliada: ID!): Boolean
    }
`;

export const Schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
});