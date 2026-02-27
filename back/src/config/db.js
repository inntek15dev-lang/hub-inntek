const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hub_inntek_catalog',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Aiven and other cloud providers require SSL
if (process.env.DB_SSL === 'true') {
    const fs = require('fs');
    const path = require('path');
    const caPath = path.join(__dirname, 'ca.pem');
    poolConfig.ssl = {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
