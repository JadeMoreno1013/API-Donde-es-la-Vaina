const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registration = {
    name: { type: 'string', required: true, max: 45 },
    last_name: { type: 'string', required: true, max: 45 },
    email: { type: 'string', required: true, max: 100, pattern: EMAIL_PATTERN },
    password: { type: 'string', required: true, min: 8, max: 255 }
};

const update = {
    ...registration,
    is_admin: { type: 'boolean' }
};

const credentials = {
    email: { type: 'string', required: true, pattern: EMAIL_PATTERN },
    password: { type: 'string', required: true }
};

module.exports = { registration, update, credentials };
