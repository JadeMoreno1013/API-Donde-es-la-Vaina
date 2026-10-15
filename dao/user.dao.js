const { pool } = require('../services/mysql.service');

const PUBLIC_COLUMNS = 'id_user, name, last_name, email, registration_date, is_admin';

const findAll = async () => {
    const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM app_user ORDER BY id_user`);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM app_user WHERE id_user = ?`, [id]);
    return rows[0];
};

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM app_user WHERE email = ?', [email]);
    return rows[0];
};

const insert = async (user) => {
    const [result] = await pool.query('INSERT INTO app_user SET ?', [user]);
    return result.insertId;
};

const update = async (id, fields) => {
    await pool.query('UPDATE app_user SET ? WHERE id_user = ?', [fields, id]);
};

const remove = async (id) => {
    await pool.query('DELETE FROM app_user WHERE id_user = ?', [id]);
};

module.exports = { findAll, findById, findByEmail, insert, update, remove };
