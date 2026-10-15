const express = require('express');
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateBody, validateBodyPartial, validateQuery, validateId } = require('../middlewares/validate.middleware');
const reviewValidator = require('../validators/review.validator');

const router = express.Router();

router.get('/', validateQuery(reviewValidator.listFilters), reviewController.list);
router.get('/:id', validateId, reviewController.getById);
router.post('/', authenticate, validateBody(reviewValidator.creation), reviewController.create);
router.patch('/:id', validateId, authenticate, validateBodyPartial(reviewValidator.update), reviewController.update);
router.delete('/:id', validateId, authenticate, reviewController.remove);

module.exports = router;
