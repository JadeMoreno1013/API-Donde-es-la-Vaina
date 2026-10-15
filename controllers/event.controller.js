const eventService = require('../services/event.service');

const list = async (req, res) => {
    res.json(await eventService.list(req.query));
};

const getById = async (req, res) => {
    res.json(await eventService.getById(Number(req.params.id)));
};

const create = async (req, res) => {
    res.status(201).json(await eventService.create(req.body));
};

const update = async (req, res) => {
    res.json(await eventService.update(Number(req.params.id), req.body));
};

const remove = async (req, res) => {
    await eventService.remove(Number(req.params.id));
    res.status(204).send();
};

const getInfo = async (req, res) => {
    res.json(await eventService.getInfo(Number(req.params.id), req.auth));
};

const updateInfo = async (req, res) => {
    res.json(await eventService.updateInfo(Number(req.params.id), req.body));
};

module.exports = { list, getById, create, update, remove, getInfo, updateInfo };
