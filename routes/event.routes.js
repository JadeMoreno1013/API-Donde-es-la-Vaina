const express = require('express');
const eventController = require('../controllers/event.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { validateBody, validateBodyPartial, validateQuery, validateId } = require('../middlewares/validate.middleware');
const eventValidator = require('../validators/event.validator');

const router = express.Router();

router.get('/', validateQuery(eventValidator.listFilters), eventController.list);
router.get('/:id', validateId, eventController.getById);
router.post('/', authenticate, requireAdmin, validateBody(eventValidator.creation), eventController.create);
router.patch('/:id', validateId, authenticate, requireAdmin, validateBodyPartial(eventValidator.update), eventController.update);
router.delete('/:id', validateId, authenticate, requireAdmin, eventController.remove);

router.get('/:id/info', validateId, authenticate, eventController.getInfo);
router.put('/:id/info', validateId, authenticate, requireAdmin, validateBody(eventValidator.infoUpdate), eventController.updateInfo);

module.exports = router;
