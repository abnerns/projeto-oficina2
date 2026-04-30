const postgres = require('postgres');
const dotenv = require('dotenv').config();

const connectionString = process.env.DB_URL
const sql = postgres(connectionString)

module.exports = sql