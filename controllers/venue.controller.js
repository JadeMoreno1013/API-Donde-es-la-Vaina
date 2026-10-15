const venueService = require('../services/venue.service');

const list = async (req, res) => {
    res.json(await venueService.list());
};

const getById = async (req, res) => {
    res.json(await venueService.getById(Number(req.params.id)));
};

const create = async (req, res) => {
    res.status(201).json(await venueService.create(req.body));
};

const update = async (req, res) => {
    res.json(await venueService.update(Number(req.params.id), req.body));
};

const remove = async (req, res) => {
    await venueService.remove(Number(req.params.id));
    res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
