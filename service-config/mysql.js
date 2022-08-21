const mysql = require('mysql2');
const dbConfig = require('./config-const')

const pool = mysql.createPool({
    uri: dbConfig.MYSQL_URL,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool