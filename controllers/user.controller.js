const userService = require('../services/user.service');

const list = async (req, res) => {
    res.json(await userService.list());
};

const getById = async (req, res) => {
    res.json(await userService.getById(Number(req.params.id)));
};

const create = async (req, res) => {
    res.status(201).json(await userService.create(req.body));
};

const update = async (req, res) => {
    res.json(await userService.update(Number(req.params.id), req.body, req.auth));
};

const remove = async (req, res) => {
    await userService.remove(Number(req.params.id));
    res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
