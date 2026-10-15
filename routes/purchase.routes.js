const express = require('express');
const purchaseController = require('../controllers/purchase.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateBody, validateQuery, validateId } = require('../middlewares/validate.middleware');
const purchaseValidator = require('../validators/purchase.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', validateBody(purchaseValidator.creation), purchaseController.create);
router.get('/', validateQuery(purchaseValidator.listFilters), purchaseController.list);
router.get('/:id', validateId, purchaseController.getById);
router.get('/:id/tickets', validateId, purchaseController.getTickets);

module.exports = router;
