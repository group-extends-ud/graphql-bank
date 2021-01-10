import { Pool } from 'pg';
import { key } from '../../private/connection';

//Pool con conexion activa a base de datos
export const pool: Pool = new Pool(key);