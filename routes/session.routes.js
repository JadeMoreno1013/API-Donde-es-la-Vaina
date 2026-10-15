const express = require('express');
const sessionController = require('../controllers/session.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');

const router = express.Router();

router.post('/', validateBody(userValidator.credentials), sessionController.create);
router.delete('/', authenticate, sessionController.destroy);

module.exports = router;
