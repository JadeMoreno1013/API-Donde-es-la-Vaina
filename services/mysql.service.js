const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

const pool = mysql.createPool({ ...config, decimalNumbers: true });

const runInTransaction = async (work) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await work(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { pool, runInTransaction };
