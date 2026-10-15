const { pool } = require('../services/mysql.service');

const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM venue ORDER BY name');
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM venue WHERE id_venue = ?', [id]);
    return rows[0];
};

const insert = async (venue) => {
    const [result] = await pool.query('INSERT INTO venue SET ?', [venue]);
    return result.insertId;
};

const update = async (id, fields) => {
    await pool.query('UPDATE venue SET ? WHERE id_venue = ?', [fields, id]);
};

const remove = async (id) => {
    await pool.query('DELETE FROM venue WHERE id_venue = ?', [id]);
};

module.exports = { findAll, findById, insert, update, remove };
