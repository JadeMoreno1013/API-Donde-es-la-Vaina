const { randomUUID } = require('crypto');
const AppError = require('../utils/app-error');
const { EVENT_STATUS } = require('../utils/constants');
const { runInTransaction } = require('./mysql.service');
const eventDao = require('../dao/event.dao');
const purchaseDao = require('../dao/purchase.dao');
const ticketDao = require('../dao/ticket.dao');

const CENTS_PER_UNIT = 100;

const assertEventOpenForSale = (event, quantity) => {
    if (event.status !== EVENT_STATUS.SCHEDULED || new Date(event.event_date) <= new Date()) {
        throw new AppError(409, 'El evento no admite compras');
    }
    if (event.available_tickets < quantity) {
        throw new AppError(409, 'No hay entradas disponibles suficientes');
    }
};

const assertPricesInRange = (event, tickets) => {
    const outOfRange = tickets.some((ticket) => ticket.price_paid < event.price_min || ticket.price_paid > event.price_max);
    if (outOfRange) {
        throw new AppError(400, `El precio de cada entrada debe estar entre ${event.price_min} y ${event.price_max}`);
    }
};

const sumPrices = (tickets) => {
    const totalCents = tickets.reduce((sum, ticket) => sum + Math.round(ticket.price_paid * CENTS_PER_UNIT), 0);
    return totalCents / CENTS_PER_UNIT;
};

const create = (body, auth) => runInTransaction(async (connection) => {
    const event = await eventDao.lockById(body.event_id, connection);
    if (!event) {
        throw new AppError(404, 'Evento no encontrado');
    }
    assertEventOpenForSale(event, body.tickets.length);
    assertPricesInRange(event, body.tickets);
    const totalAmount = sumPrices(body.tickets);
    const purchaseId = await purchaseDao.insert(
        { app_user_id: auth.id_user, event_id: event.id_event, total_amount: totalAmount },
        connection
    );
    const tickets = body.tickets.map((ticket) => ({
        zone: ticket.zone,
        price_paid: ticket.price_paid,
        ticket_code: randomUUID()
    }));
    await ticketDao.insertMany(purchaseId, tickets, connection);
    await eventDao.decreaseAvailableTickets(event.id_event, tickets.length, connection);
    return { id_purchase: purchaseId, event_id: event.id_event, total_amount: totalAmount, tickets };
});

const list = (query, auth) => {
    const filters = { ...query, user_id: auth.is_admin ? query.user_id : auth.id_user };
    return purchaseDao.findAll(filters);
};

const getById = async (id, auth) => {
    const purchase = await purchaseDao.findById(id);
    if (!purchase) {
        throw new AppError(404, 'Compra no encontrada');
    }
    if (!auth.is_admin && purchase.app_user_id !== auth.id_user) {
        throw new AppError(403, 'No tiene permiso sobre esta compra');
    }
    return purchase;
};

const getTickets = async (id, auth) => {
    await getById(id, auth);
    return ticketDao.findByPurchaseId(id);
};

module.exports = { create, list, getById, getTickets };
