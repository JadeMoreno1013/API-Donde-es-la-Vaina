const reviewService = require('../services/review.service');

const list = async (req, res) => {
    res.json(await reviewService.list(req.query));
};

const getById = async (req, res) => {
    res.json(await reviewService.getById(Number(req.params.id)));
};

const create = async (req, res) => {
    res.status(201).json(await reviewService.create(req.body, req.auth));
};

const update = async (req, res) => {
    res.json(await reviewService.update(Number(req.params.id), req.body, req.auth));
};

const remove = async (req, res) => {
    await reviewService.remove(Number(req.params.id), req.auth);
    res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
