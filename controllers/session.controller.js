const sessionService = require('../services/session.service');

const create = async (req, res) => {
    res.status(201).json(await sessionService.create(req.body));
};

const destroy = (req, res) => {
    sessionService.destroy(req.token);
    res.status(204).send();
};

module.exports = { create, destroy };
