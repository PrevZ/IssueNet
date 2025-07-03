const mysql = require('mysql2/promise');
const config = require('../config');

// Funzione per creare una connessione al database
async function getConnection() {
    const connection = await mysql.createConnection(config.db);
    return connection;
}

// Funzione per eseguire una query SQL con parametri
async function execute(connection, sql, params) {
    const [results, fields] = await connection.execute(sql, params);
    return results;  // Restituisce solo i risultati, non i metadati
}

// Esporta le funzioni 
module.exports = { getConnection, execute };