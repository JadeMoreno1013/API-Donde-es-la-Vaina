const AppError = require('../utils/app-error');
const pick = require('../utils/pick');
const venueDao = require('../dao/venue.dao');

const VENUE_FIELDS = ['name', 'address', 'city', 'venue_capacity'];

const list = () => venueDao.findAll();

const getById = async (id) => {
    const venue = await venueDao.findById(id);
    if (!venue) {
        throw new AppError(404, 'Lugar no encontrado');
    }
    return venue;
};

const create = async (body) => {
    const id = await venueDao.insert(pick(body, VENUE_FIELDS));
    return venueDao.findById(id);
};

const update = async (id, body) => {
    await getById(id);
    await venueDao.update(id, pick(body, VENUE_FIELDS));
    return venueDao.findById(id);
};

const remove = async (id) => {
    await getById(id);
    await venueDao.remove(id);
};

module.exports = { list, getById, create, update, remove };
