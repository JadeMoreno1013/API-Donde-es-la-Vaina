const AppError = require('../utils/app-error');
const pick = require('../utils/pick');
const { runInTransaction } = require('./mysql.service');
const eventDao = require('../dao/event.dao');
const eventInfoDao = require('../dao/event-info.dao');
const venueDao = require('../dao/venue.dao');
const purchaseDao = require('../dao/purchase.dao');
const { validateEventDetails } = require('../validators/event-details.validator');

const CREATION_FIELDS = [
    'venue_id', 'event_type', 'name', 'description', 'image_url',
    'event_date', 'price_min', 'price_max', 'event_capacity'
];
const UPDATE_FIELDS = [
    'venue_id', 'name', 'description', 'image_url',
    'event_date', 'status', 'price_min', 'price_max'
];

const list = (filters) => eventDao.findAll(filters);

const getById = async (id) => {
    const event = await eventDao.findById(id);
    if (!event) {
        throw new AppError(404, 'Evento no encontrado');
    }
    return event;
};

const assertVenueFits = async (body) => {
    const venue = await venueDao.findById(body.venue_id);
    if (!venue) {
        throw new AppError(404, 'Lugar no encontrado');
    }
    if (body.event_capacity > venue.venue_capacity) {
        throw new AppError(400, 'El cupo del evento supera la capacidad del lugar');
    }
};

const create = async (body) => {
    if (body.price_max < body.price_min) {
        throw new AppError(400, 'price_max no puede ser menor que price_min');
    }
    validateEventDetails(body.event_type, body.event_details);
    await assertVenueFits(body);
    const event = { ...pick(body, CREATION_FIELDS), available_tickets: body.event_capacity };
    const id = await runInTransaction(async (connection) => {
        const eventId = await eventDao.insert(event, connection);
        await eventInfoDao.insert(eventId, body.event_details, connection);
        return eventId;
    });
    return eventDao.findById(id);
};

const update = async (id, body) => {
    const event = await getById(id);
    if (body.event_details !== undefined) {
        validateEventDetails(event.event_type, body.event_details);
    }
    const fields = pick(body, UPDATE_FIELDS);
    await runInTransaction(async (connection) => {
        if (Object.keys(fields).length > 0) {
            await eventDao.update(id, fields, connection);
        }
        if (body.event_details !== undefined) {
            await eventInfoDao.updateByEventId(id, body.event_details, connection);
        }
    });
    return eventDao.findById(id);
};

const remove = async (id) => {
    await getById(id);
    await eventDao.remove(id);
};

const getInfo = async (id, auth) => {
    const event = await getById(id);
    if (!auth.is_admin && !(await purchaseDao.existsForUserAndEvent(auth.id_user, id))) {
        throw new AppError(403, 'Debe tener una compra para este evento');
    }
    return { event_id: id, event_type: event.event_type, event_details: event.event_details };
};

const updateInfo = async (id, body) => {
    const event = await getById(id);
    validateEventDetails(event.event_type, body.event_details);
    await eventInfoDao.updateByEventId(id, body.event_details);
    return { event_id: id, event_type: event.event_type, event_details: body.event_details };
};

module.exports = { list, getById, create, update, remove, getInfo, updateInfo };
