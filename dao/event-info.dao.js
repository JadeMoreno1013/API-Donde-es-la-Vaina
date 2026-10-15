const { pool } = require('../services/mysql.service');

const insert = async (eventId, details, executor = pool) => {
    await executor.query(
        'INSERT INTO event_info (event_id, event_details) VALUES (?, ?)',
        [eventId, JSON.stringify(details)]
    );
};

const updateByEventId = async (eventId, details, executor = pool) => {
    await executor.query(
        'UPDATE event_info SET event_details = ? WHERE event_id = ?',
        [JSON.stringify(details), eventId]
    );
};

module.exports = { insert, updateByEventId };
