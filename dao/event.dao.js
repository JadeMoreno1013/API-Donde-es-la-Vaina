const { pool } = require('../services/mysql.service');
const { buildWhereClause } = require('../utils/sql');

const LIST_QUERY = `
    SELECT e.*, v.name AS venue_name, v.city AS venue_city
    FROM event e
    JOIN venue v ON v.id_venue = e.venue_id
    LEFT JOIN event_info i ON i.event_id = e.id_event`;

const DETAIL_QUERY = `
    SELECT e.*, v.name AS venue_name, v.city AS venue_city, i.event_details
    FROM event e
    JOIN venue v ON v.id_venue = e.venue_id
    LEFT JOIN event_info i ON i.event_id = e.id_event
    WHERE e.id_event = ?`;

const buildConditions = (filters) => {
    const conditions = [];
    const values = [];
    if (filters.event_type) {
        conditions.push('e.event_type = ?');
        values.push(filters.event_type);
    }
    if (filters.status) {
        conditions.push('e.status = ?');
        values.push(filters.status);
    }
    if (filters.max_price) {
        conditions.push('e.price_min <= ?');
        values.push(Number(filters.max_price));
    }
    if (filters.search) {
        conditions.push('(e.name LIKE ? OR CAST(i.event_details AS CHAR) LIKE ?)');
        values.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    return { conditions, values };
};

const findAll = async (filters) => {
    const { conditions, values } = buildConditions(filters);
    const [rows] = await pool.query(`${LIST_QUERY}${buildWhereClause(conditions)} ORDER BY e.event_date`, values);
    return rows;
};

const findById = async (id, executor = pool) => {
    const [rows] = await executor.query(DETAIL_QUERY, [id]);
    return rows[0];
};

const lockById = async (id, connection) => {
    const [rows] = await connection.query('SELECT * FROM event WHERE id_event = ? FOR UPDATE', [id]);
    return rows[0];
};

const insert = async (event, executor = pool) => {
    const [result] = await executor.query('INSERT INTO event SET ?', [event]);
    return result.insertId;
};

const update = async (id, fields, executor = pool) => {
    await executor.query('UPDATE event SET ? WHERE id_event = ?', [fields, id]);
};

const decreaseAvailableTickets = async (id, quantity, connection) => {
    await connection.query(
        'UPDATE event SET available_tickets = available_tickets - ? WHERE id_event = ?',
        [quantity, id]
    );
};

const remove = async (id) => {
    await pool.query('DELETE FROM event WHERE id_event = ?', [id]);
};

module.exports = { findAll, findById, lockById, insert, update, decreaseAvailableTickets, remove };
