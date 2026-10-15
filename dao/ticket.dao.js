const { pool } = require('../services/mysql.service');

const findByPurchaseId = async (purchaseId) => {
    const [rows] = await pool.query(
        'SELECT * FROM ticket WHERE purchase_id = ? ORDER BY id_ticket',
        [purchaseId]
    );
    return rows;
};

const insertMany = async (purchaseId, tickets, connection) => {
    const rows = tickets.map((ticket) => [purchaseId, ticket.zone, ticket.price_paid, ticket.ticket_code]);
    await connection.query(
        'INSERT INTO ticket (purchase_id, zone, price_paid, ticket_code) VALUES ?',
        [rows]
    );
};

module.exports = { findByPurchaseId, insertMany };
