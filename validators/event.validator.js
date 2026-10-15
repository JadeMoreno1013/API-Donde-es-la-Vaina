const { EVENT_TYPES, EVENT_STATUS } = require('../utils/constants');

const EVENT_STATUSES = Object.values(EVENT_STATUS);

const creation = {
    venue_id: { type: 'integer', required: true, min: 1 },
    event_type: { type: 'string', required: true, oneOf: EVENT_TYPES },
    name: { type: 'string', required: true, max: 100 },
    description: { type: 'string', required: true },
    image_url: { type: 'string', max: 255 },
    event_date: { type: 'datetime', required: true },
    price_min: { type: 'number', required: true, min: 0 },
    price_max: { type: 'number', required: true, min: 0 },
    event_capacity: { type: 'integer', required: true, min: 1 },
    event_details: { type: 'object', required: true }
};

const update = {
    venue_id: creation.venue_id,
    name: creation.name,
    description: creation.description,
    image_url: creation.image_url,
    event_date: creation.event_date,
    status: { type: 'string', oneOf: EVENT_STATUSES },
    price_min: creation.price_min,
    price_max: creation.price_max,
    event_details: creation.event_details
};

const infoUpdate = {
    event_details: { type: 'object', required: true }
};

const listFilters = {
    event_type: { type: 'string', oneOf: EVENT_TYPES },
    status: { type: 'string', oneOf: EVENT_STATUSES },
    max_price: { type: 'numeric', min: 0 },
    search: { type: 'string', max: 100 }
};

module.exports = { creation, update, infoUpdate, listFilters };
