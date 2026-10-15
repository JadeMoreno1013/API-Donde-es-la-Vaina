const { pool } = require('../services/mysql.service');
const { buildWhereClause } = require('../utils/sql');

const LIST_QUERY = `
    SELECT p.*, u.name AS buyer_name, u.email AS buyer_email,
           e.name AS event_name, e.event_type, e.event_date,
           (SELECT COUNT(*) FROM ticket t WHERE t.purchase_id = p.id_purchase) AS ticket_count
    FROM purchase p
    JOIN app_user u ON u.id_user = p.app_user_id
    JOIN event e ON e.id_event = p.event_id`;

const buildConditions = (filters) => {
    const conditions = [];
    const values = [];
    if (filters.user_id) {
        conditions.push('p.app_user_id = ?');
        values.push(Number(filters.user_id));
    }
    if (filters.date) {
        conditions.push('DATE(p.purchase_date) = ?');
        values.push(filters.date);
    }
    if (filters.period === 'upcoming') {
        conditions.push('e.event_date >= NOW()');
    }
    if (filters.period === 'past') {
        conditions.push('e.event_date < NOW()');
    }
    return { conditions, values };
};

const findAll = async (filters) => {
    const { conditions, values } = buildConditions(filters);
    const [rows] = await pool.query(`${LIST_QUERY}${buildWhereClause(conditions)} ORDER BY p.purchase_date DESC`, values);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM purchase WHERE id_purchase = ?', [id]);
    return rows[0];
};

const existsForUserAndEvent = async (userId, eventId) => {
    const [rows] = await pool.query(
        'SELECT 1 FROM purchase WHERE app_user_id = ? AND event_id = ? LIMIT 1',
        [userId, eventId]
    );
    return rows.length > 0;
};

const insert = async (purchase, connection) => {
    const [result] = await connection.query('INSERT INTO purchase SET ?', [purchase]);
    return result.insertId;
};

module.exports = { findAll, findById, existsForUserAndEvent, insert };
