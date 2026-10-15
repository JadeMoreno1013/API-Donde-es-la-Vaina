const buildWhereClause = (conditions) => (
    conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
);

module.exports = { buildWhereClause };
