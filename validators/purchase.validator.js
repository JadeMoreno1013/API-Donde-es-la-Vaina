const creation = {
    event_id: { type: 'integer', required: true, min: 1 },
    tickets: {
        type: 'array',
        required: true,
        min: 1,
        items: {
            type: 'object',
            fields: {
                zone: { type: 'string', required: true, max: 45 },
                price_paid: { type: 'number', required: true, min: 0 }
            }
        }
    }
};

const listFilters = {
    user_id: { type: 'numeric', min: 1 },
    date: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
    period: { type: 'string', oneOf: ['upcoming', 'past'] }
};

module.exports = { creation, listFilters };
