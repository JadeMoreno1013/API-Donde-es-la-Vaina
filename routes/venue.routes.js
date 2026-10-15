const express = require('express');
const venueController = require('../controllers/venue.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { validateBody, validateId } = require('../middlewares/validate.middleware');
const venueValidator = require('../validators/venue.validator');

const router = express.Router();

router.get('/', venueController.list);
router.get('/:id', validateId, venueController.getById);
router.post('/', authenticate, requireAdmin, validateBody(venueValidator.venue), venueController.create);
router.put('/:id', validateId, authenticate, requireAdmin, validateBody(venueValidator.venue), venueController.update);
router.delete('/:id', validateId, authenticate, requireAdmin, venueController.remove);

module.exports = router;
