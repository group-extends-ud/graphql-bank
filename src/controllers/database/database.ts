import { Pool } from 'pg';
import { key } from '../../private/connection';

export const pool: Pool = new Pool(key);