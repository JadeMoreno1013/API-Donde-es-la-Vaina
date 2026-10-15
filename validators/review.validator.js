const RATING_RULE = { type: 'integer', min: 1, max: 5 };

const creation = {
    purchase_id: { type: 'integer', required: true, min: 1 },
    rating: { ...RATING_RULE, required: true },
    comment: { type: 'string' },
    seat_rating: RATING_RULE,
    tags: { type: 'array', items: { type: 'string', max: 30 } }
};

const update = {
    rating: RATING_RULE,
    comment: creation.comment,
    seat_rating: RATING_RULE,
    tags: creation.tags
};

const listFilters = {
    event_id: { type: 'numeric', min: 1 },
    user_id: { type: 'numeric', min: 1 }
};

module.exports = { creation, update, listFilters };
