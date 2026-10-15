const AppError = require('../utils/app-error');
const { EVENT_STATUS } = require('../utils/constants');
const pick = require('../utils/pick');
const eventDao = require('../dao/event.dao');
const purchaseDao = require('../dao/purchase.dao');
const reviewDao = require('../dao/review.dao');

const CREATION_FIELDS = ['purchase_id', 'rating', 'comment', 'seat_rating'];
const UPDATE_FIELDS = ['rating', 'comment', 'seat_rating'];

const serializeTags = (body) => (body.tags === undefined ? {} : { tags: JSON.stringify(body.tags) });

const list = (filters) => reviewDao.findAll(filters);

const getById = async (id) => {
    const review = await reviewDao.findById(id);
    if (!review) {
        throw new AppError(404, 'Reseña no encontrada');
    }
    return review;
};

const assertOwner = (review, auth) => {
    if (review.app_user_id !== auth.id_user) {
        throw new AppError(403, 'Solo el autor puede modificar esta reseña');
    }
};

const create = async (body, auth) => {
    const purchase = await purchaseDao.findById(body.purchase_id);
    if (!purchase) {
        throw new AppError(404, 'Compra no encontrada');
    }
    if (purchase.app_user_id !== auth.id_user) {
        throw new AppError(403, 'La compra pertenece a otro usuario');
    }
    const event = await eventDao.findById(purchase.event_id);
    if (event.status !== EVENT_STATUS.FINISHED) {
        throw new AppError(409, 'Solo se puede reseñar un evento finalizado');
    }
    if (await reviewDao.findByPurchaseId(body.purchase_id)) {
        throw new AppError(409, 'Ya existe una reseña para esta compra');
    }
    const id = await reviewDao.insert({ ...pick(body, CREATION_FIELDS), ...serializeTags(body) });
    return getById(id);
};

const update = async (id, body, auth) => {
    assertOwner(await getById(id), auth);
    await reviewDao.update(id, { ...pick(body, UPDATE_FIELDS), ...serializeTags(body) });
    return getById(id);
};

const remove = async (id, auth) => {
    const review = await getById(id);
    if (!auth.is_admin) {
        assertOwner(review, auth);
    }
    await reviewDao.remove(id);
};

module.exports = { list, getById, create, update, remove };
