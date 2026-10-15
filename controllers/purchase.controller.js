const purchaseService = require('../services/purchase.service');

const create = async (req, res) => {
    res.status(201).json(await purchaseService.create(req.body, req.auth));
};

const list = async (req, res) => {
    res.json(await purchaseService.list(req.query, req.auth));
};

const getById = async (req, res) => {
    res.json(await purchaseService.getById(Number(req.params.id), req.auth));
};

const getTickets = async (req, res) => {
    res.json(await purchaseService.getTickets(Number(req.params.id), req.auth));
};

module.exports = { create, list, getById, getTickets };
