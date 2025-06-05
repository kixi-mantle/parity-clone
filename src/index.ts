import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres'
import { Client } from 'pg';
import * as schema from './db/schema'


const client = new Client({
    host : process.env.PGHOST,
    port : Number(process.env.PGPORT),
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database : process.env.PGDATABASE,
})


await client.connect();
const db = drizzle(client , {schema});

export default db
