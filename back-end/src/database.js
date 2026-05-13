import postgres from 'postgres';
import dotenv from 'dotenv/config';

const connectionString = process.env.VITE_DB_URL
const sql = postgres(connectionString)

export default sql;