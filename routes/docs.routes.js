const fs = require('fs');
const path = require('path');
const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const specification = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(specification));

module.exports = router;
