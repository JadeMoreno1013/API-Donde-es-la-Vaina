const { pool } = require('../services/mysql.service');
const { buildWhereClause } = require('../utils/sql');

const BASE_QUERY = `
    SELECT r.*, p.app_user_id, p.event_id, u.name AS author_name
    FROM review r
    JOIN purchase p ON p.id_purchase = r.purchase_id
    JOIN app_user u ON u.id_user = p.app_user_id`;

const findAll = async (filters) => {
    const conditions = [];
    const values = [];
    if (filters.event_id) {
        conditions.push('p.event_id = ?');
        values.push(Number(filters.event_id));
    }
    if (filters.user_id) {
        conditions.push('p.app_user_id = ?');
        values.push(Number(filters.user_id));
    }
    const [rows] = await pool.query(`${BASE_QUERY}${buildWhereClause(conditions)} ORDER BY r.review_date DESC`, values);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`${BASE_QUERY} WHERE r.id_review = ?`, [id]);
    return rows[0];
};

const findByPurchaseId = async (purchaseId) => {
    const [rows] = await pool.query('SELECT id_review FROM review WHERE purchase_id = ?', [purchaseId]);
    return rows[0];
};

const insert = async (review) => {
    const [result] = await pool.query('INSERT INTO review SET ?', [review]);
    return result.insertId;
};

const update = async (id, fields) => {
    await pool.query('UPDATE review SET ? WHERE id_review = ?', [fields, id]);
};

const remove = async (id) => {
    await pool.query('DELETE FROM review WHERE id_review = ?', [id]);
};

module.exports = { findAll, findById, findByPurchaseId, insert, update, remove };
