const venue = {
    name: { type: 'string', required: true, max: 100 },
    address: { type: 'string', required: true, max: 150 },
    city: { type: 'string', required: true, max: 45 },
    venue_capacity: { type: 'integer', required: true, min: 1 }
};

module.exports = { venue };
