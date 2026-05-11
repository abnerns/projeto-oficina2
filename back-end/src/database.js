import postgres from 'postgres';
import dotenv from 'dotenv/config';

const connectionString = process.env.DB_URL
const sql = postgres(connectionString)

export default sql;