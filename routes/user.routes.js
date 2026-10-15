const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin, requireSelfOrAdmin } = require('../middlewares/auth.middleware');
const { validateBody, validateBodyPartial, validateId } = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');

const router = express.Router();

router.post('/', validateBody(userValidator.registration), userController.create);
router.get('/', authenticate, requireAdmin, userController.list);
router.get('/:id', validateId, authenticate, requireSelfOrAdmin, userController.getById);
router.patch('/:id', validateId, authenticate, requireSelfOrAdmin, validateBodyPartial(userValidator.update), userController.update);
router.delete('/:id', validateId, authenticate, requireAdmin, userController.remove);

module.exports = router;
